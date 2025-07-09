"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { ClassesSelect } from "@/lib/types";
import {
  BulkClassesType,
  BulkDeleteClassesSchema,
  BulkDeleteClassesType,
  ClassesSchema,
  ClassesType,
  GenericDeleteType,
  GenericDleteSchema as GenericDeleteSchema,
  gradesType,
  UpdateClassSchema,
  UpdateClassType,
  BulkClassesSchema,
} from "@/lib/validation";
import { Prisma } from "../../../../../../prisma/generated/client";
import { revalidatePath } from "next/cache";
import "server-only";

export const createClassAction = async (values: ClassesType) => {
  try {
    const permission = await hasPermissions("create:classes");

    if (!permission) throw new Error("unauthorized!");

    const result = ClassesSchema.safeParse(values);

    let zodErrors = {};

    if (!result.success) {
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
            code: result.data?.code.trim(),
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
      code: result.data?.code.trim() as string,
      name: result.data?.name.trim() as string,
      createdAt: result.data?.createdAt as Date | undefined,
      level: result.data?.level.trim() as gradesType,
    };

    const response = await prisma.class.create({
      data: {
        code: normalizedClass.code,
        name: normalizedClass.name,
        createdAt: normalizedClass.createdAt,
        departmentId: normalizedClass.departmentId,
        level: normalizedClass.level,
        teachers: normalizedClass.teachers
          ? {
              connect: normalizedClass.teachers.map((teacherId) => ({
                id: teacherId,
              })),
            }
          : undefined,
      },
      select: ClassesSelect,
    });

    return { class: response };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getClassesAction = async (codes?: string[]) => {
  try {
    const permission = await hasPermissions("view:class");

    if (!permission) throw new Error("unauthorized!");

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

    return { data };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const getClass = async (id: string) => {
  try {
    const permission = await hasPermissions("view:classes");

    if (!permission) throw new Error("Unauthorized!");

    const data = await prisma.class.findUnique({
      where: {
        id,
      },
      select: ClassesSelect,
    });

    if (!data) return { error: "Class not found!" };

    return data;
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
};

export const updateClass = async (values: UpdateClassType) => {
  try {
    const permission = await hasPermissions("edit:classes");

    if (!permission) throw new Error("unauthorized!");

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
        teachers: {
          connect: rest.teachers?.map((teacherId) => ({ id: teacherId })),
        },
      },
      select: ClassesSelect,
    });

    if (!updatedClass) return { error: "Could not update class!" };

    return { class: updatedClass };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const deleteClass = async (param: GenericDeleteType) => {
  try {
    const permission = await hasPermissions("delete:classes");

    if (!permission) throw new Error("Permission denied!");

    const { error, success, data } = GenericDeleteSchema.safeParse(param);

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

    const classRecord = await prisma.class.delete({
      where: {
        id: data?.id,
      },
      select: ClassesSelect,
    });

    if (!classRecord) {
      return { error: "Could not delete class" };
    }

    return { class: classRecord };
  } catch (error: any) {
    console.error(`Could not delete Class: ${error.message}`);

    return { error: getErrorMessage(error) };
  }
};

export const bulkDeleteClasses = async (ids: BulkDeleteClassesType) => {
  try {
    const permission = await hasPermissions("delete:classes");
    if (!permission) throw new Error("unauthorized!");
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

    return { count };
  } catch (error: any) {
    console.error(`Could not perform the bulk delete: ${error.message}`);

    return { error: "Something went wrong!" };
  }
};

export const bulkUploadClasses = async (values: BulkClassesType) => {
  console.log("values: ", values);
  try {
    const permission = await hasPermissions("create:classes");
    if (!permission) throw new Error("Unauthorized!");
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
      code: item.code.trim(),
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
      };
    });

    const departmentPromiseFulfilled = await Promise.all(departmentPromises);

    const teachersPromises = departmentPromiseFulfilled.map(async (item) => {
      const teacher = await prisma.teacher.findUnique({
        where: {
          employeeId: item.teacherId,
        },
      });

      return {
        ...item,
        createdAt: new Date(item.createdAt),
        teachers: [teacher?.id as string],
      };
    });

    const teacherPromisesFulFilled = await Promise.all(teachersPromises);

    const createPromises = teacherPromisesFulFilled.map((klass) => {
      const { teacherId, department, ...rest } = klass;

      return prisma.class.create({
        data: {
          ...rest,
          teachers: {
            connect: klass.teachers.map((teacherId) => ({ id: teacherId })),
          },
        },
        select: ClassesSelect,
      });
    });

    const bulkcreateResponse = (await prisma.$transaction(createPromises))
      .length;

    return { count: bulkcreateResponse };
  } catch (error: any) {
    console.error(`Could not perform the bulk upload: ${error.message}`);

    return { error: "Something went wrong!" };
  } finally {
    revalidatePath("/classes");
  }
};
