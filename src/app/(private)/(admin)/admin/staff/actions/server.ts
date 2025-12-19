"use server";
import "server-only";
import { prisma } from "@/lib/prisma";
import { StaffSelect } from "@/lib/types";
import { StaffSchema, StaffType } from "@/lib/validation";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { generatePassword } from "@/lib/generatePassword";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { client } from "@/utils/qstash";
import { env } from "@/lib/server-only-actions/validate-env";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createStaff = async (values: unknown) => {
  try {
    const permissions = await hasPermissions("create:staff");
    if (!permissions) {
      return { error: "Permission denied!" };
    }

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

    const normalizedStaff = {
      ...data,
      rgNumber: data.rgNumber?.trim() || undefined,
      ghcardNumber: data.ghcardNumber?.trim() || undefined,
      licencedNumber: data.licencedNumber?.trim() || undefined,
      ssnitNumber: data.ssnitNumber?.trim() || undefined,
      password: generatePassword(),
    };

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

    // Determine appropriate role based on staff type and category
    let roleName = "staff"; // fallback
    if (normalizedStaff.staffType === "Teaching") {
      roleName = "teaching_staff";
    } else if (normalizedStaff.staffType === "Non_Teaching") {
      if (normalizedStaff.staffCategory === "Professional") {
        roleName = "admin_staff";
      } else if (normalizedStaff.staffCategory === "Non_Professional") {
        roleName = "support_staff";
      }
    }

    const [existingStaff, existingUser, staffRole] = await prisma.$transaction([
      prisma.staff.findFirst({
        where: {
          OR: [
            { employeeId: normalizedStaff.employeeId },
            { rgNumber: normalizedStaff.rgNumber },
            { ghcardNumber: normalizedStaff.ghcardNumber },
            { ssnitNumber: normalizedStaff.ssnitNumber },
            { licencedNumber: normalizedStaff.licencedNumber },
          ],
        },
      }),
      prisma.user.findFirst({
        where: {
          OR: [
            { email: normalizedStaff.email },
            { username: normalizedStaff.username },
          ],
        },
      }),

      prisma.role.findFirst({
        where: {
          name: roleName,
        },
        select: {
          id: true,
        },
      }),
    ]);

    if (!staffRole) {
      return { error: "Staff role not found!" };
    }

    const errors: string[] = [];
    if (existingUser !== null) {
      if (existingUser.email === normalizedStaff.email) {
        errors.push(`Email ${normalizedStaff.email} already exist!`);
      }

      if (existingUser.username === normalizedStaff.username) {
        errors.push(`Username ${normalizedStaff.username} is already taken!`);
      }
    }

    if (existingStaff !== null) {
      if (existingStaff.employeeId === normalizedStaff.employeeId) {
        errors.push(
          `Employee ID ${normalizedStaff.employeeId} already exists!`
        );
      }

      if (existingStaff.rgNumber === normalizedStaff.rgNumber) {
        errors.push(
          `Registered No. ${normalizedStaff.rgNumber} already exists!`
        );
      }

      if (existingStaff.ghcardNumber === normalizedStaff.ghcardNumber) {
        errors.push(
          `GhanaCard No. ${normalizedStaff.ghcardNumber} already exists!`
        );
      }

      if (existingStaff.ssnitNumber === normalizedStaff.ssnitNumber) {
        errors.push(`SSNIT No. ${normalizedStaff.ssnitNumber} already exists!`);
      }

      if (existingStaff.licencedNumber === normalizedStaff.licencedNumber) {
        errors.push(
          `Licenced No. ${normalizedStaff.licencedNumber} already exists!`
        );
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    const {
      email,
      username,
      departmentId,
      password,
      isDepartmentHead,
      imageURL,
      imageFile,
      ...rest
    } = normalizedStaff;

    // Create user account first
    await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password,
        name: `${rest.firstName} ${rest.lastName}`,
        username: username,
        callbackURL: "/email-verified",
      },
      headers: await headers(),
    });

    // Get the created user to connect to staff
    const createdUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!createdUser) {
      return { error: "Failed to create user account" };
    }

    // Update user with role
    await prisma.user.update({
      where: { id: createdUser.id },
      data: { roleId: staffRole.id },
    });

    // Create staff record
    const staff = await prisma.staff.create({
      data: {
        ...rest,

        department: departmentId
          ? {
              connect: { id: departmentId },
            }
          : undefined,
        departmentHead:
          departmentId && isDepartmentHead
            ? {
                connect: { id: departmentId },
              }
            : undefined,
        courses: rest.courses
          ? {
              connect: rest.courses.map((courseId) => ({ id: courseId })),
            }
          : undefined,
        classes: rest.classes
          ? {
              connect: rest.classes.map((classId) => ({ id: classId })),
            }
          : undefined,
        user: {
          connect: { id: createdUser.id },
        },
      },
      select: StaffSelect,
    });

    if (normalizedStaff.imageFile) {
      const arrayBuffer = await (
        normalizedStaff.imageFile as File
      ).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const jobData = {
        file: {
          buffer: buffer.toString("base64"),
          name: (normalizedStaff.imageFile as File).name,
          type: (normalizedStaff.imageFile as File).type,
        },
        entityId: staff.userId,
        folder: "staff",
        entityType: "user" as const,
      };

      await client.publishJSON({
        url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
        body: jobData,
      });
    }

    const emailData = {
      to: [email as string],
      username: staff.firstName,
      data: {
        lastName: staff.lastName,
        email: email as string,
        password: normalizedStaff.password,
      },
    };

    await client.publishJSON({
      url: `${env.NEXT_PUBLIC_URL}/api/send/emails`,
      body: emailData,
    });

    revalidatePath("/admin/staff");

    return { staff };
  } catch (error) {
    console.error("Could not create staff:", error);
    return { error: getErrorMessage(error) };
  }
};

export const getStaff = async (employeeIds?: string[]) => {
  try {
    const permission = await hasPermissions("view:staff");

    if (!permission) {
      return { error: "Permission denied!" };
    }

    let query: Prisma.StaffWhereInput = {};

    if (employeeIds) {
      query = {
        id: { in: employeeIds },
      };
    }

    const staff = await prisma.staff.findMany({
      where: query,
      select: StaffSelect,
      orderBy: {
        firstName: "asc",
      },
    });

    return { staff };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getStaffMember = async (id: string) => {
  try {
    const permission = await hasPermissions("view:staff");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const staff = await prisma.staff.findUnique({
      where: { id },
      select: StaffSelect,
    });

    if (!staff) {
      return { error: `No Staff found with this ${id}` };
    }

    return { staff };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateStaff = async (id: string, data: StaffType) => {
  try {
    const permission = await hasPermissions("edit:staff");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const unvalidData = StaffSchema.safeParse(data);

    if (!unvalidData.success) {
      const zodErrors = unvalidData.error.errors
        .map((err) => `${err.path[0]}: ${err.message}`)
        .join("\n");
      return {
        error: zodErrors,
      };
    }

    const { email, username, ...rest } = unvalidData.data;

    const normalizedStaff = {
      ...rest,
      ghcardNumber: rest.ghcardNumber?.trim() || null,
      licencedNumber: rest.licencedNumber?.trim() || null,
      rgNumber: rest.rgNumber?.trim() || null,
      ssnitNumber: rest.ssnitNumber?.trim() || null,
    };

    const { isDepartmentHead, imageURL, imageFile, ...others } =
      normalizedStaff;

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
      const arrayBuffer = await (imageFile as File).arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const jobData = {
        file: {
          buffer: buffer.toString("base64"),
          name: (normalizedStaff.imageFile as File).name,
          type: (normalizedStaff.imageFile as File).type,
        },
        entityId: updatedRecord.userId,
        folder: "staff",
        entityType: "user" as const,
      };
      await client.publishJSON({
        url: `${env.NEXT_PUBLIC_URL}/api/images/uploads`,
        body: jobData,
      });
    }

    revalidatePath("/admin/staff");

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
      return { error: getErrorMessage(error) };
    }
  }
};

export const deleteStaffRequest = async (id: string) => {
  try {
    const permission = await hasPermissions("delete:staff");
    if (!permission) {
      return { error: "Permission denied!" };
    }

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

    revalidatePath("/admin/staff");

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const bulkDeleteStaff = async (rows: string[]) => {
  try {
    const permission = await hasPermissions("delete:staff");
    if (!permission) {
      return { error: "Permission denied!" };
    }

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

    revalidatePath("/admin/staff");

    return { count };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};
