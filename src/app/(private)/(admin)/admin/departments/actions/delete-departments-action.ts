"use server";
import "server-only";

import { prisma } from "@/lib/prisma";
import { DepartmentSelect } from "@/lib/types";
import {
  DeleteDepartmentsSchema,
  DeleteDepartmentsType,
} from "@/lib/validation";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { revalidatePath } from "next/cache";

export const deleteDepartments = async (data: DeleteDepartmentsType) => {
  try {
    const { hasPermission } =
      await getUserWithPermissions("delete:departments");
    if (!hasPermission) return { error: "Permission denied!" };

    const { ids } = DeleteDepartmentsSchema.parse(data);
    const { count } = await prisma.department.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (!count) {
      return { error: "Could not delete the records!" };
    }

    revalidatePath("/admin/departments");

    return { count };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    const { hasPermission } =
      await getUserWithPermissions("delete:departments");
    if (!hasPermission)
      return { error: "You do not have the permissions to perform this task" };

    const data = await prisma.department.delete({
      where: { id: id },
      select: DepartmentSelect,
    });

    if (!data) return { error: `No department with ID: ${id} found!` };

    revalidatePath("/admin/departments");
    return { success: true, error: "" };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};
