"use server";

import "server-only";

import { getErrorMessage } from "@/lib/getErrorMessage";

import { prisma } from "@/lib/prisma";
import { ClassesSelect } from "@/lib/types";
import {
  BulkClassesType,
  BulkDeleteClassesSchema,
  BulkDeleteClassesType,
  ClassesSchema,
  ClassesType,
  gradesType,
  UpdateClassSchema,
  UpdateClassType,
  BulkClassesSchema,
} from "@/lib/validation";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import "server-only";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { z } from "zod";
import { CONSTANTS } from "@/utils/generateStudentIndex";
import { generateUniqueClassCode } from "../utils/generate-class-code";

export const createClassAction = async (values: ClassesType) => {
  try {
    const { hasPermission } = await getUserWithPermissions("create:classes");

    if (!hasPermission) return { error: "Permission denied!" };

    const result = ClassesSchema.safeParse(values);

    let zodErrors = {};

    if (!result.success || result.error) {
      result.error.issues.forEach((issue) => {
        zodErrors = { ...zodErrors, [issue.path[0]]: issue.message };
      });
    }

    if (Object.keys(zodErrors).length > 0) {
      return { errors: zodErrors };
    }

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
      checks.map((check) => Promise.all([check.codeCheck, check.nameCheck]))
    );

    results.forEach((classResult) => {
      const [codeCheck, nameCheck] = classResult;

      if (codeCheck) {
        prismaErrors.push(
          `Class code "${result.data?.code}" is already taken!`
        );
      }

      if (nameCheck) {
        prismaErrors.push(`Class Name "${result.data?.name}" is already taken`);
      }
    });

    if (prismaErrors.length > 0) return { prismaErrors: prismaErrors };

    const normalizedClass = {
      ...result.data,
      code: result.data?.code?.trim() as string,
      name: result.data?.name.trim() as string,
      createdAt: result.data?.createdAt as Date | undefined,
      level: result.data?.level.trim() as gradesType,
      maxCapacity: result.data?.maxCapacity as number | undefined,
    };

    const createdDate = new Date(
      normalizedClass.createdAt as Date
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
      ? Number.isNaN(parseInt(lastClass.code.slice(-CONSTANTS.SEQUENCE_LENGTH)))
        ? 1
        : parseInt(lastClass.code.slice(-CONSTANTS.SEQUENCE_LENGTH)) + 1
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
              sequenceNumber
            ),
        name: normalizedClass.name,
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

    revalidatePath("/admin/classes");

    return { class: response };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getClassesAction = async (codes?: string[]) => {
  try {
    const { hasPermission } = await getUserWithPermissions("view:classes");

    if (!hasPermission) return { error: "Permision denied" };

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
    const { hasPermission } = await getUserWithPermissions("view:classes");

    if (!hasPermission) return { error: "Permission denied!" };

    const data = await prisma.class.findUnique({
      where: {
        id,
      },
      select: ClassesSelect,
    });

    if (!data) return { error: "Class not found!" };

    return { data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateClass = async (values: UpdateClassType) => {
  try {
    const hasPermission = await getUserWithPermissions("edit:classes");

    if (!hasPermission) return { error: "Permission denied!" };

    const result = UpdateClassSchema.safeParse(values);

    console.log(result.data);

    let zodErrors = {};

    if (result.error) {
      result.error.issues.forEach((issue) => ({
        zodErrors: { ...zodErrors, [issue.path[0]]: issue.message },
      }));
    }

    if (Object.keys(zodErrors).length > 0) {
      return { errors: zodErrors };
    }

    const { id, ...rest } = result.data!;

    const updatedClass = await prisma.class.update({
      where: {
        id: id,
      },
      data: {
        ...rest,
        createdAt: rest.createdAt as Date,
        departmentId: rest.departmentId ? rest.departmentId : null,
        code: rest.code as string,
        staff: {
          connect: rest.staff?.map((staffId) => ({ id: staffId })),
        },
      },
      select: ClassesSelect,
    });

    if (!updatedClass) return { error: "Could not update class!" };

    revalidatePath("/admin/classes");

    return { class: updatedClass };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const deleteClass = async (
  id: string | Prisma.ClassWhereUniqueInput
) => {
  try {
    const hasPermission = await getUserWithPermissions("delete:classes");

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
    const hasPermission = await getUserWithPermissions("delete:classes");
    if (!hasPermission) return { error: "Permission denied!" };
    const { error, success, data } = BulkDeleteClassesSchema.safeParse(ids);

    if (!success) {
      const zodError = error.errors.reduce(
        (acc, issue) => {
          acc[issue.path[0]] = issue.message;
          return acc;
        },
        {} as Record<string, string>
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
  currentEnrollment: number
) => {
  try {
    const hasPermission = await getUserWithPermissions("edit:classes");

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
    const hasPermission = await getUserWithPermissions("create:classes");
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
      checks.map((check) => Promise.all([check.codeCheck, check.nameCheck]))
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
              sequenceNumber
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
      })
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
      })
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
