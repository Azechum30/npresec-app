"use server";
import "server-only";
import { prisma } from "@/lib/prisma";
import { Prisma } from "../../../../../../prisma/generated/client";
import { DepartmentType, DepartmentSchema } from "@/lib/validation";
import { DepartmentSelect } from "@/lib/types";
import { hasPermissions } from "@/lib/hasPermission";

export const createDepartment = async (values: DepartmentType) => {
  try {
    const permissions = await hasPermissions("create:departments");

    if (!permissions) throw new Error("Unauthorized!");

    const { data, success, error } = DepartmentSchema.safeParse(values);

    if (!success) {
      const zodError = error.flatten();
      const errors = zodError.fieldErrors.code
        ? zodError.fieldErrors.code[0]
        : zodError.fieldErrors.name
          ? zodError.fieldErrors.name[0]
          : zodError.fieldErrors.headId
            ? zodError.fieldErrors.headId[0]
            : zodError.fieldErrors.createdAt
              ? zodError.fieldErrors.createdAt[0]
              : "A zod validation error has occured!";
      return { error: errors };
    }

    const department = await prisma.department.create({
      data: data,
      select: DepartmentSelect,
    });

    if (!department) {
      return { error: "Could not create department" };
    }

    return { department };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        return {
          error: "Foreign Key Constraint failed!",
        };
      } else if (error.code === "P2002") {
        const targetFields = error.meta?.target as string[];
        const errorMessage = targetFields.includes("code")
          ? "Department code already taken!"
          : targetFields.includes("name")
            ? "Department name already taken!"
            : "Teacher is already assigned!";
        return { error: errorMessage };
      }
    } else if (error instanceof TypeError) {
      console.log("Type Error", error);
      return { error: "Invalid argument type" };
    }
  }
};

export const updateDepartmentAction = async (
  id: string,
  values: DepartmentType
) => {
  try {
    const permissions = await hasPermissions("edit:department");

    if (!permissions) throw new Error("Unauthorized!");

    const { data, success, error } = DepartmentSchema.safeParse(values);

    if (!success) {
      const zodError = error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      }));

      return {
        error: zodError.map((err) => `${err.field}, ${err.message}`).join("\n"),
      };
    }

    const response = await prisma.department.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
      select: DepartmentSelect,
    });

    if (!response) {
      return { error: "Update failed!" };
    }

    return response;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        console.error("Error: ", "Foreign key constraint failed");
        return {
          error: "Foreign key constraint failed",
        };
      } else if (error.code === "P2002") {
        const targetFields = error.meta?.target as string[];
        const errorMessage = targetFields.includes("code")
          ? "Department code already taken!"
          : targetFields.includes("name")
            ? "Department name already taken!"
            : "Teacher is already assigned!";
        return { error: errorMessage };
      }
    } else if (error instanceof TypeError) {
      return { error: "Invalid arguments" };
    } else {
      return { error: "Unknown error has occured!" };
    }
  }
};
