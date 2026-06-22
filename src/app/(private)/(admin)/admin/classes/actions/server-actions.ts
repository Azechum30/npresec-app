/** biome-ignore-all assist/source/organizeImports: reason */
"use server";

import "server-only";

import { getErrorMessage } from "@/lib/getErrorMessage";

import type { Prisma } from "@/generated/prisma/client";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { ClassesSelect } from "@/lib/types";
import {
  BulkClassesSchema,
  type BulkClassesType,
  BulkDeleteClassesSchema,
  type BulkDeleteClassesType,
  ClassesSchema,
  type ClassesType,
  type gradesType,
  UpdateClassSchema,
  type UpdateClassType,
} from "@/lib/validation";
import { CONSTANTS } from "@/utils/generateStudentIndex";
import { revalidatePath } from "next/cache";
import "server-only";
import { z } from "zod";
import { generateUniqueClassCode } from "../utils/generate-class-code";

export const createClassAction = async (values: ClassesType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:classes");

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const result = ClassesSchema.safeParse(values);

    if (!result.success) throw result.error;

    const prismaErrors: string[] = [];

    const checks = await Promise.all([
      {
        codeCheck: prisma.class.findFirst({
          where: {
            code: result.data?.code?.trim(),
          },
        }),
        nameCheck: prisma.class.findFirst({
          where: {
            name: result.data?.name.trim(),
          },
        }),
      },
    ]);

    const results = await Promise.all(
      checks.map((check) => Promise.all([check.codeCheck, check.nameCheck])),
    );

    results.forEach((classResult) => {
      const [codeCheck, nameCheck] = classResult;

      if (codeCheck) {
        prismaErrors.push(
          `Class code "${result.data?.code}" is already taken!`,
        );
      }

      if (nameCheck) {
        prismaErrors.push(`Class Name "${result.data?.name}" is already taken`);
      }
    });

    if (prismaErrors.length > 0) throw new ActionError(prismaErrors[0]);

    const normalizedClass = {
      ...result.data,
      code: result.data?.code?.trim() as string,
      name: result.data?.name.trim() as string,
      createdAt: result.data?.createdAt as Date | undefined,
      level: result.data?.level.trim() as gradesType,
      maxCapacity: result.data?.maxCapacity as number | undefined,
      classTeacherId: result.data.classTeacherId ?? null,
    };

    const createdDate = new Date(
      normalizedClass.createdAt as Date,
    ).getFullYear();

    const lastClass = await prisma.class.findFirst({
      where: {
        departmentId: normalizedClass.departmentId,
        createdAt: {
          gte: new Date(createdDate, 0, 1),
          lte: new Date(createdDate + 1, 0, 1),
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: { code: true, department: { select: { name: true } } },
    });

    const sequenceNumber = lastClass
      ? Number.isNaN(
          parseInt(lastClass.code.slice(-CONSTANTS.SEQUENCE_LENGTH), 10),
        )
        ? 1
        : parseInt(lastClass.code.slice(-CONSTANTS.SEQUENCE_LENGTH), 10) + 1
      : 1;

    const response = await prisma.class.create({
      data: {
        code: result.data?.code
          ? normalizedClass.code
          : generateUniqueClassCode(
              createdDate,
              lastClass?.department?.name
                ? lastClass.department.name
                : normalizedClass.name,
              sequenceNumber,
            ),
        name: normalizedClass.name,
        classTeacherId: normalizedClass.classTeacherId,
        createdAt: normalizedClass.createdAt,
        departmentId: normalizedClass.departmentId,
        level: normalizedClass.level,
        staff: normalizedClass.staff
          ? {
              connect: normalizedClass.staff.map((staffId) => ({
                id: staffId,
              })),
            }
          : undefined,
        maxCapacity: normalizedClass.maxCapacity,
      },
      select: ClassesSelect,
    });

    return { class: response };
  } catch (error) {
    if (error instanceof ActionError) throw error;
    return { error: getErrorMessage(error) };
  }
};

export const getClassesAction = async (codes?: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("view:classes");

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    let query: Prisma.ClassWhereInput = {};

    if (codes) {
      query = {
        code: { in: codes },
      };
    }

    const data = await prisma.class.findMany({
      where: query,
      orderBy: {
        createdAt: "asc",
      },
      select: ClassesSelect,
    });

    return { data: data || [] };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getClass = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:classes");

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const data = await prisma.class.findUnique({
      where: {
        id,
      },
      select: ClassesSelect,
    });

    if (!data) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return { data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateClass = async (values: UpdateClassType) => {
  try {
    const hasPermission = await getUserPermissions("edit:classes");

    if (!hasPermission) return { error: "Permission denied!" };

    const result = UpdateClassSchema.safeParse(values);

    if (!result.success) throw result.error;

    const { id, ...rest } = result.data;

    const duplicate = await prisma.class.findFirst({
      where: {
        AND: [
          {
            OR: [
              { code: rest.code as string },
              { name: rest.name },
              { classTeacherId: rest.classTeacherId },
            ],
          },
          { id: { not: id } },
        ],
      },
    });

    if (duplicate) {
      if (duplicate.code === rest.code) {
        throw new ActionError("A class already exists with this code");
      } else if (duplicate.name === rest.name) {
        throw new ActionError("A class already exists with this name");
      } else if (duplicate.classTeacherId === rest.classTeacherId) {
        throw new ActionError(
          "The selected staff is already assigned as a form master",
        );
      } else throw new ActionError("A duplicate record found");
    }

    const updatedClass = await prisma.class.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
        createdAt: rest.createdAt as Date,
        departmentId: rest.departmentId ? rest.departmentId : null,
        classTeacherId: rest.classTeacherId,
        code: rest.code as string,
        staff: {
          connect: rest.staff?.map((staffId) => ({ id: staffId })),
        },
      },
      select: ClassesSelect,
    });

    if (!updatedClass) throw new ActionError("Failed to update class");

    return { class: updatedClass };
  } catch (error) {
    console.error(error);
    if (error instanceof ActionError) {
      throw error;
    } else {
      const err = getErrorMessage(error);
      throw err;
    }
  }
};

export const deleteClass = async (
  id: string | Prisma.ClassWhereUniqueInput,
) => {
  try {
    const hasPermission = await getUserPermissions("delete:classes");

    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = z
      .object({ id: z.string().cuid() })
      .safeParse(id);

    if (!success || error) {
      return { error: error.issues[0].message };
    }

    const classRecord = await prisma.class.delete({
      where: {
        id: data?.id,
      },
      select: ClassesSelect,
    });

    if (!classRecord) {
      return { error: "Could not delete class" };
    }

    revalidatePath("admin/classes");

    return { class: classRecord };
  } catch (error: any) {
    console.error(`Could not delete Class: ${error.message}`);

    return { error: getErrorMessage(error) };
  }
};

export const bulkDeleteClasses = async (ids: BulkDeleteClassesType) => {
  try {
    const hasPermission = await getUserPermissions("delete:classes");
    if (!hasPermission) return { error: "Permission denied!" };
    const { error, success, data } = BulkDeleteClassesSchema.safeParse(ids);

    if (!success) {
      const zodError = error.issues.reduce(
        (acc, issue) => {
          acc[issue.path[0] as any] = issue.message;
          return acc;
        },
        {} as Record<string, string>,
      );

      return { error: zodError };
    }

    const { count } = await prisma.class.deleteMany({
      where: {
        id: { in: data.ids },
      },
    });

    if (!count) return { error: "Could not delete classes!" };

    revalidatePath("/admin/classes");

    return { count };
  } catch (error: any) {
    console.error(`Could not perform the bulk delete: ${error.message}`);

    return { error: "Something went wrong!" };
  }
};

export const updateClassEnrollment = async (
  classId: string,
  currentEnrollment: number,
) => {
  try {
    const hasPermission = await getUserPermissions("edit:classes");

    if (!hasPermission) return { error: "Permission denied!" };

    const updatedClass = await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        currentEnrollment,
      },
      select: ClassesSelect,
    });

    if (!updatedClass) return { error: "Could not update class enrollment!" };

    revalidatePath("/admin/classes");

    return { class: updatedClass };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const bulkUploadClasses = async (values: BulkClassesType) => {
  try {
    const hasPermission = await getUserPermissions("create:classes");
    if (!hasPermission) return { error: "Permission denied" };
    const errors: string[] = [];

    const { success, error, data } = BulkClassesSchema.safeParse(values);

    if (!success) {
      const zodError = error.issues.map((err) => ({
        field: err.path.join("."),
        error: err.message,
      }));

      return {
        error: zodError.map((err) => `${err.field}: ${err.error}`).join("\n"),
      };
    }

    const normalizedClasses = data?.data.map((item) => ({
      ...item,
      code: item.code?.trim(),
      name: item.name.trim(),
    }));

    const checks = normalizedClasses.map((klass) => ({
      codeCheck: prisma.class.findUnique({
        where: {
          code: klass.code,
        },
      }),
      nameCheck: prisma.class.findUnique({
        where: {
          name: klass.name,
        },
      }),
    }));

    const result = await Promise.all(
      checks.map((check) => Promise.all([check.codeCheck, check.nameCheck])),
    );

    result.forEach((result) => {
      const [codeCheck, nameCheck] = result;

      if (codeCheck) {
        errors.push(`${codeCheck.code} is already taken!`);
      }

      if (nameCheck) {
        errors.push(`${nameCheck.name} is already taken!`);
      }
    });

    if (errors.length > 0) {
      return { errors };
    }

    const departmentPromises = normalizedClasses.map(async (klass) => {
      const department = await prisma.department.findUnique({
        where: {
          name: klass.department,
        },
      });

      return {
        ...klass,
        departmentId: department?.id,
        deptName: department?.name,
      };
    });

    const departmentPromiseFulfilled = await Promise.all(departmentPromises);

    const staffPromises = departmentPromiseFulfilled.map(async (item) => {
      const staff = await prisma.staff.findUnique({
        where: {
          employeeId: item.staffId,
        },
      });

      return {
        ...item,
        createdAt: new Date(item.createdAt),
        staff: [staff?.id as string],
      };
    });

    const staffPromisesFulFilled = await Promise.all(staffPromises);

    // Generate unique codes for classes without codes
    const classesWithCodes = await Promise.all(
      staffPromisesFulFilled.map(async (klass) => {
        const { staffId, deptName, department, ...rest } = klass;

        let finalCode = rest.code;

        // If no code provided, generate a unique one
        if (!finalCode) {
          let sequenceNumber = 1;
          let generatedCode: string;

          do {
            generatedCode = generateUniqueClassCode(
              rest.createdAt.getFullYear(),
              deptName ? deptName : rest.name,
              sequenceNumber,
            );
            sequenceNumber++;
          } while (
            await prisma.class.findUnique({
              where: { code: generatedCode },
            })
          );

          finalCode = generatedCode;
        }

        return {
          ...rest,
          code: finalCode,
          staff: klass.staff,
        };
      }),
    );

    const createPromises = classesWithCodes.map((klass) =>
      prisma.class.create({
        data: {
          ...klass,
          staff: {
            connect: klass.staff.map((staffId) => ({ id: staffId })),
          },
        },
        select: ClassesSelect,
      }),
    );

    const bulkcreateResponse = (await prisma.$transaction(createPromises))
      .length;

    if (!bulkcreateResponse) return { error: "Could import data" };

    revalidatePath("/admin/classes");

    return { count: bulkcreateResponse };
  } catch (error: any) {
    console.error(`Could not perform the bulk upload: ${error.message}`);

    return { error: "Something went wrong!" };
  }
};
