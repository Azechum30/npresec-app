"use server";
import "server-only";
import { prisma } from "@/lib/prisma";
import { TeacherSelect } from "@/lib/types";
import { TeacherSchema, TeacherType } from "@/lib/validation";
import { Prisma } from "../../../../../../prisma/generated/client";
import argon2 from "argon2";

import { revalidatePath } from "next/cache";
import { sendMail } from "@/lib/resend-config";
import { generatePassword } from "@/lib/generatePassword";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";

export const createTeacher = async (values: TeacherType) => {
  try {
    const permissions = await hasPermissions("create:teachers");
    if (!permissions) {
      return { error: "Permission denied!" };
    }

    const { data, error, success } = TeacherSchema.safeParse(values);

    if (!success) {
      const zodError = error.issues.map((issue) => ({
        field: [issue.path.join(".")],
        message: issue.message,
      }));

      return {
        error: zodError.map((e) => `${e.field}: ${e.message}`).join("\n"),
      };
    }

    const normalizedTeacher = {
      ...data,
      rgNumber: data.rgNumber?.trim() || undefined,
      ghcardNumber: data.ghcardNumber?.trim() || undefined,
      licencedNumber: data.licencedNumber?.trim() || undefined,
      ssnitNumber: data.ssnitNumber?.trim() || undefined,
      password: generatePassword(),
    };

    if (normalizedTeacher.departmentId) {
      const department = await prisma.department.findUnique({
        where: { id: normalizedTeacher.departmentId },
        select: { headId: true },
      });

      if (department?.headId !== null && normalizedTeacher.isDepartmentHead) {
        return {
          error: "The Selected Department already has a head assigned.",
        };
      }
    }

    const [existingTeacher, existingUser, teacherRole] =
      await prisma.$transaction([
        prisma.teacher.findFirst({
          where: {
            OR: [
              { employeeId: normalizedTeacher.employeeId },
              { rgNumber: normalizedTeacher.rgNumber },
              { ghcardNumber: normalizedTeacher.ghcardNumber },
              { ssnitNumber: normalizedTeacher.ssnitNumber },
              { licencedNumber: normalizedTeacher.licencedNumber },
            ],
          },
        }),
        prisma.user.findFirst({
          where: {
            OR: [
              { email: normalizedTeacher.email },
              { username: normalizedTeacher.username },
            ],
          },
        }),

        prisma.role.findFirst({
          where: {
            name: "teacher",
          },
          select: {
            id: true,
          },
        }),
      ]);

    if (!teacherRole) {
      return { error: "Teacher role not found!" };
    }

    const errors: string[] = [];
    if (existingUser !== null) {
      if (existingUser.email === normalizedTeacher.email) {
        errors.push(`Email ${normalizedTeacher.email} already exist!`);
      }

      if (existingUser.username === normalizedTeacher.username) {
        errors.push(`Username ${normalizedTeacher.username} is already taken!`);
      }
    }

    if (existingTeacher !== null) {
      if (existingTeacher.employeeId === normalizedTeacher.employeeId) {
        errors.push(
          `Employee ID ${normalizedTeacher.employeeId} already exists!`
        );
      }

      if (existingTeacher.rgNumber === normalizedTeacher.rgNumber) {
        errors.push(
          `Registered No. ${normalizedTeacher.rgNumber} already exists!`
        );
      }

      if (existingTeacher.ghcardNumber === normalizedTeacher.ghcardNumber) {
        errors.push(
          `GhanaCard No. ${normalizedTeacher.ghcardNumber} already exists!`
        );
      }

      if (existingTeacher.ssnitNumber === normalizedTeacher.ssnitNumber) {
        errors.push(
          `SSNIT No. ${normalizedTeacher.ssnitNumber} already exists!`
        );
      }

      if (existingTeacher.licencedNumber === normalizedTeacher.licencedNumber) {
        errors.push(
          `Licenced No. ${normalizedTeacher.licencedNumber} already exists!`
        );
      }
    }

    if (errors.length > 0) {
      return { errors };
    }

    const hashedTeacher = {
      ...normalizedTeacher,
      password: await argon2.hash(normalizedTeacher.password, {
        type: argon2.argon2id,
      }),
    };

    if (normalizedTeacher.imageFile) {
      const secure_url = await uploadToCloudinary(
        normalizedTeacher.imageFile,
        "teachers"
      );

      if (secure_url) {
        normalizedTeacher.imageURL = secure_url;
        delete normalizedTeacher["imageFile"];
      } else {
        delete normalizedTeacher["imageFile"];
      }
    }

    const {
      email,
      username,
      departmentId,
      password,
      isDepartmentHead,
      imageURL,
      ...rest
    } = hashedTeacher;

    const teacher = await prisma.teacher.create({
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
          create: {
            email: email as string,
            username: username as string,
            password: password,
            roleId: teacherRole.id,
            resetPasswordRequired: true,
            picture: (imageURL as string) ?? undefined,
          },
        },
      },

      select: TeacherSelect,
    });

    await sendMail({
      to: [email as string],
      username: teacher.firstName,
      data: {
        lastName: teacher.lastName,
        email: email as string,
        password: normalizedTeacher.password,
      },
    });

    return { teacher };
  } catch (error) {
    console.error("Could not create teacher:", error);
    return { error: `Something went wrong!` };
  } finally {
    revalidatePath("/teachers");
  }
};

export const getTeachers = async (employeeIds?: string[]) => {
  try {
    const permission = await hasPermissions("view:teachers");

    if (!permission) {
      return { error: "Permission denied!" };
    }

    let query: Prisma.TeacherWhereInput = {};

    if (employeeIds) {
      query = {
        id: { in: employeeIds },
      };
    }

    const teachers = await prisma.teacher.findMany({
      where: query,
      select: TeacherSelect,
      orderBy: {
        firstName: "asc",
      },
    });

    return { teachers };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getTeacher = async (id: string) => {
  try {
    const permission = await hasPermissions("view:teachers");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const teacher = await prisma.teacher.findUnique({
      where: { id },
      select: TeacherSelect,
    });

    if (!teacher) {
      return { error: `No Teacher found with this ${id}` };
    }

    return { teacher };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateTeacher = async (id: string, data: TeacherType) => {
  try {
    const permission = await hasPermissions("edit:teachers");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const unvalidData = TeacherSchema.safeParse(data);

    if (!unvalidData.success) {
      const zodErrors = unvalidData.error.errors
        .map((err) => `${err.path[0]}: ${err.message}`)
        .join("\n");
      return {
        error: zodErrors,
      };
    }

    const { email, username, ...rest } = unvalidData.data;

    const normalizedTeacher = {
      ...rest,
      ghcardNumber: rest.ghcardNumber?.trim() || null,
      licencedNumber: rest.licencedNumber?.trim() || null,
      rgNumber: rest.rgNumber?.trim() || null,
      ssnitNumber: rest.ssnitNumber?.trim() || null,
    };

    if (normalizedTeacher.departmentId) {
      const department = await prisma.department.findUnique({
        where: {
          id: normalizedTeacher.departmentId,
        },
        select: { head: true },
      });

      if (department?.head !== null && normalizedTeacher.isDepartmentHead) {
        return {
          error: "The Selected department already has a head assigned!",
        };
      }
    }

    if (normalizedTeacher.imageFile) {
      const secure_url = await uploadToCloudinary(
        normalizedTeacher.imageFile,
        "teachers"
      );
      if (secure_url) {
        normalizedTeacher.imageURL = secure_url;
        delete normalizedTeacher["imageFile"];
      }
      {
        delete normalizedTeacher["imageFile"];
      }
    }

    const { isDepartmentHead, imageURL, ...others } = normalizedTeacher;

    const updatedRecord = await prisma.teacher.update({
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
            picture: (imageURL as string) ?? undefined,
          },
        },
      },
      select: TeacherSelect,
    });

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

export const deleteTeacherRequest = async (id: string) => {
  try {
    const permission = await hasPermissions("delete:teachers");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const teacherWithUserId = await prisma.teacher.findFirst({
      where: {
        id,
        userId: { not: null },
      },
      select: { userId: true },
    });

    if (teacherWithUserId !== null) {
      await prisma.user.delete({
        where: {
          id: teacherWithUserId.userId as string,
        },
      });
    }

    if (!teacherWithUserId) {
      return { error: `No teacher with ID ${id} found!` };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};

export const bulkDeleteTeachers = async (rows: string[]) => {
  try {
    const permission = await hasPermissions("delete:teachers");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const teachersWithUserIds = await prisma.teacher.findMany({
      where: {
        id: { in: rows },
        userId: { not: null },
      },
      select: { userId: true },
    });

    const userIdsToDelete = teachersWithUserIds.map(
      (teacher) => teacher.userId
    );

    if (userIdsToDelete.length > 0) {
      await prisma.user.deleteMany({
        where: {
          id: { in: userIdsToDelete as string[] },
        },
      });
    }

    const count = userIdsToDelete.length;

    if (!count) return { error: "Could not delete records!" };

    return { count };
  } catch (error) {
    console.error(error);
    return { error: getErrorMessage(error) };
  }
};
