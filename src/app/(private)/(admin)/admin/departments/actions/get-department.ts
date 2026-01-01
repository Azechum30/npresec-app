"use server";

import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { DepartmentSelect } from "@/lib/types";

export const getDepartment = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:departments");

    if (!hasPermission) throw new Error("Unauthorized!");

    const department = await prisma.department.findUnique({
      where: {
        id: id,
      },
      select: DepartmentSelect,
    });

    if (!department) return { error: "No department found!" };

    return { department };
  } catch (error) {
    console.error("Could not fetch department: ", error);
    return { error: "Something went wrong!" };
  }
};
