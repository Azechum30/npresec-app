"use server";

import { getSession } from "@/lib/get-user";
import { prisma } from "@/lib/prisma";
import { DepartmentSelect } from "@/lib/types";
import {
  DeleteDepartmentsSchema,
  DeleteDepartmentsType,
} from "@/lib/validation";

export const deleteDepartments = async (data: DeleteDepartmentsType) => {
  try {
    const { user } = await getSession();

    if (!user) throw new Error("Unauthorized!");

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

    return { count };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};

export const deleteDepartment = async (id: string) => {
  try {
    const { user } = await getSession();
    if (!user) throw new Error("Unauthorized");

    const data = await prisma.department.delete({
      where: { id: id },
      select: DepartmentSelect,
    });

    if (!data) return { error: `No department with ID: ${id} found!` };

    return data;
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong!" };
  }
};
