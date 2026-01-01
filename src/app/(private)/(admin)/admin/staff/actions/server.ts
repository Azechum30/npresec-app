"use server";
import "server-only";
import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { StaffSchema, StaffType } from "@/lib/validation";
import { Prisma } from "@/generated/prisma/client";
import { revalidateTag } from "next/cache";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getCachedStaff } from "../utils/get-cached-staff";
import { resolveRole } from "@/lib/resolve-staff-role";
import { createUserCredentials } from "@/utils/create-user-credentials";
import { transformAndValidateStaffData } from "@/utils/staff-data-transformer";
import { checkExistingRelatedRecords } from "../utils/check-existing-related-records";
import { triggerImageUpload } from "@/utils/trigger-image-upload";
import { triggerStaffCreation } from "../utils/trigger-staff-creation";
import { triggerSendEmail } from "@/lib/trigger-send-email";
import { getUserPermissions } from "@/lib/get-session";

export const createStaff = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("create:staff");

    if (!hasPermission) return { error: "Permission denied" };

    const { data, error, success } = StaffSchema.safeParse(values);

    if (!success || error) {
      const zodError = error.issues.map((issue) => ({
        field: [issue.path.join(".")],
        message: issue.message,
      }));

      return {
        error: zodError.map((e) => `${e.field}: ${e.message}`).join("\n"),
      };
    }

    const normalizedStaff = transformAndValidateStaffData(data);

    if (normalizedStaff.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: normalizedStaff.departmentId },
        select: { headId: true },
      });

      if (department?.headId !== null && normalizedStaff.isDepartmentHead) {
        return {
          error: "The Selected Department already has a head assigned.",
        };
      }
    }

    const roleName = resolveRole(normalizedStaff);

    const { error: duplicates, staffRole } = await checkExistingRelatedRecords(
      normalizedStaff,
      roleName,
    );

    if (duplicates) {
      return { error: duplicates };
    }

    const { password, imageURL, imageFile, email, username, ...rest } =
      normalizedStaff;

    const { user } = await createUserCredentials({
      email: email,
      username: username,
      lastName: rest.lastName,
      password,
      roleId: staffRole?.id as string,
    });

    const { staff, error: staffCreationError } = await triggerStaffCreation(
      user.id,
      rest,
    );

    if (staffCreationError) {
      return { error: staffCreationError };
    }

    if (normalizedStaff.imageFile && staff) {
      void (await triggerImageUpload(
        imageFile as File,
        staff.userId as string,
        "staff",
        "user" as const,
      ));
    }

    if (staff) {
      const emailData = {
        to: [email as string],
        username: staff.firstName,
        data: {
          lastName: staff.lastName,
          email: email as string,
          password: normalizedStaff.password,
        },
      };

      void triggerSendEmail(emailData);
    }

    void revalidateTag("staff", "seconds");

    return { staff };
  } catch (error) {
    console.error("Could not create staff:", error);

    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(error)
          : "Something went wrong!",
    };
  }
};

export const getStaff = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:staff");

    if (!hasPermission) return { error: "Permission denied" };

    const staffData = await getCachedStaff();

    return { staff: staffData || [] };
  } catch (error) {
    console.error("Could not fetch staff:", error);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : "Something went wrong!",
    };
  }
};

export const getStaffMember = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:staff");
    if (!hasPermission) return { error: "Permission denied" };

    const staff = await prisma.staff.findUnique({
      where: { id },
      select: StaffSelect,
    });

    if (!staff) {
      return { error: `No Staff found with this ${id}` };
    }

    return { staff };
  } catch (error) {
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : "Something went wrong!",
    };
  }
};

export const updateStaff = async (id: string, data: StaffType) => {
  try {
    const { hasPermission } = await getUserPermissions("update:staff");
    if (!hasPermission) return { error: "Permission denied" };

    const unvalidData = StaffSchema.safeParse(data);

    if (!unvalidData.success) {
      const zodErrors = unvalidData.error.errors
        .map((err) => `${err.path[0]}: ${err.message}`)
        .join("\n");
      return {
        error: zodErrors,
      };
    }

    const normalizedStaff = transformAndValidateStaffData(unvalidData.data);

    const {
      email,
      username,
      password,
      isDepartmentHead,
      imageURL,
      imageFile,
      ...others
    } = normalizedStaff;

    const updatedRecord = await prisma.staff.update({
      where: {
        id,
      },
      data: {
        ...others,
        departmentId: undefined,
        department: others.departmentId
          ? {
              connect: { id: others.departmentId },
            }
          : undefined,
        departmentHead:
          others.departmentId && isDepartmentHead
            ? {
                connect: { id: others.departmentId },
              }
            : undefined,
        courses: others.courses
          ? {
              set: others.courses.map((courseId) => ({
                id: courseId,
              })),
            }
          : undefined,
        classes: others.classes
          ? {
              set: others.classes.map((classId) => ({
                id: classId,
              })),
            }
          : undefined,
        user: {
          update: {
            email: email as string,
            username: username as string,
            image: imageFile ? "Upload Pending" : imageURL,
          },
        },
      },
      select: StaffSelect,
    });

    if (imageFile) {
      void (await triggerImageUpload(
        imageFile as File,
        updatedRecord.userId as string,
        "staff",
        "user" as const,
      ));
    }

    void revalidateTag("staff", "seconds");

    return { data: updatedRecord };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        const targetFields = error.meta?.target as string[];

        const errorMessage = targetFields.includes("headId")
          ? "The department already has a head assigned"
          : "Foreign key validation failed!";

        return { error: errorMessage };
      } else if (error.code === "P2002") {
        const targetFields = error.meta?.target as string[];
        const errorMessage = targetFields.includes("employeeId")
          ? "Staff ID already exists"
          : "An unknown error has occurred!";

        return { error: errorMessage };
      }
    } else if (error instanceof TypeError) {
      return { error: "Invalid arguments passed!" };
    } else {
      return {
        error:
          process.env.NODE_ENV === "development"
            ? getErrorMessage(error)
            : "Something went wrong!",
      };
    }
  }
};

export const deleteStaffRequest = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:staff");
    if (!hasPermission) return { error: "Permission denied" };

    const staffWithUserId = await prisma.staff.findFirst({
      where: {
        id,
        userId: { not: null },
      },
      select: { userId: true },
    });

    if (staffWithUserId !== null) {
      await prisma.user.delete({
        where: {
          id: staffWithUserId.userId as string,
        },
      });
    }

    if (!staffWithUserId) {
      return { error: `No staff with ID ${id} found!` };
    }

    void revalidateTag("staff", "seconds");

    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : "Something went wrong!",
    };
  }
};

export const bulkDeleteStaff = async (rows: string[], user?: any) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:staff");
    if (!hasPermission) return { error: "Permission denied" };
    const staffWithUserIds = await prisma.staff.findMany({
      where: {
        id: { in: rows },
        userId: { not: null },
      },
      select: { userId: true },
    });

    const userIdsToDelete = staffWithUserIds.map((staff) => staff.userId);

    if (userIdsToDelete.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: { in: userIdsToDelete as string[] },
        },
      });
    }

    const count = userIdsToDelete.length;

    if (!count) return { error: "Could not delete records!" };

    void revalidateTag("staff", "seconds");

    return { count };
  } catch (error) {
    console.error(error);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : "Something went wrong!",
    };
  }
};
