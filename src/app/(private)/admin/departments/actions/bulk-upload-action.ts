"use server";
import "server-only";
import { prisma } from "@/lib/prisma";
import {
  BulkUploadDepartmentSchema,
  BulkUploadDepartmentType,
} from "@/lib/validation";
import { revalidatePath } from "next/cache";
import { DepartmentSelect } from "@/lib/types";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";

export const bulkUploadDepartments = async (
  values: BulkUploadDepartmentType
) => {
  try {
    const permissions = await hasPermissions(
      ["view:departments", "create:departments"],
      { requireAll: true }
    );
    if (!permissions) throw new Error("Unauthorized!");

    const { data, error, success } =
      BulkUploadDepartmentSchema.safeParse(values);

    if (!success) {
      const zodErrors = error.issues.map((issue) => ({
        field: [issue.path[0]],
        message: issue.message,
      }));

      return {
        error: zodErrors.map((e) => `${e.field}, ${e.message}`).join("\n"),
      };
    }

    const normalizedDepartments = data.data.map((department) => ({
      ...department,
      code: department.code.trim(),
      name: department.name.trim(),
      headId: department?.headId?.trim() || "",
      description: department?.description?.trim() || "",
    }));

    const HODs = await Promise.all(
      normalizedDepartments.map(
        async (department) =>
          await prisma.teacher.findFirst({
            where: {
              employeeId: department.headId,
            },
          })
      )
    );

    const errors: string[] = [];

    HODs.map((t, index) => {
      if (t === null) {
        errors.push(
          `No Teacher exists with ${normalizedDepartments[index].headId} exist!`
        );
      }
    });

    const teacherMap = HODs.reduce(
      (acc, curr) => {
        if (curr !== null) {
          acc[curr.employeeId] = curr.id;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    normalizedDepartments.forEach((department) => {
      if (teacherMap[department.headId as string]) {
        department.headId = teacherMap[department.headId as string];
      }
    });

    const codes = normalizedDepartments.map((department) => department.code);
    const names = normalizedDepartments.map((department) => department.name);
    const headIds = normalizedDepartments.map(
      (department) => department.headId
    );

    const existingDepartments = await prisma.department.findMany({
      where: {
        OR: [
          { code: { in: codes } },
          { name: { in: names } },
          { headId: { in: headIds as string[] } },
        ],
      },
      select: DepartmentSelect,
    });

    if (existingDepartments.length > 0) {
      existingDepartments.forEach((department) => {
        if (codes.includes(department.code)) {
          errors.push(`Department code '${department.code} already exists!'`);
        }
        if (names.includes(department.name)) {
          errors.push(`${department.name} already exists!`);
        }

        if (headIds.includes(department.headId as string)) {
          errors.push(
            `The teacher by name ${department.head?.firstName} ${department.head?.lastName} is already assigned!`
          );
        }
      });
    }

    if (errors.length > 0) {
      return { errors };
    }

    const departments = await prisma.$transaction(
      normalizedDepartments.map((department) =>
        prisma.department.create({
          data: {
            code: department.code,
            name: department.name,
            description: department.description,
            createdAt: department.createdAt
              ? new Date(department.createdAt)
              : undefined,
            headId: undefined,
            head: department.headId
              ? {
                  connect: { id: department.headId },
                }
              : undefined,
          },
          select: DepartmentSelect,
        })
      )
    );

    if (!(departments.length > 0)) {
      return { error: "Could not upload departments!" };
    }

    return { count: departments.length };
  } catch (error) {
    return { error: getErrorMessage(error) };
  } finally {
    revalidatePath("/departments");
  }
};
