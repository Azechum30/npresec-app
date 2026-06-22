"use server";

import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { DepartmentSelect } from "@/lib/types";

export const getDepartment = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:departments");

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const department = await prisma.department.findUnique({
      where: {
        id: id,
      },
      select: DepartmentSelect,
    });

    if (!department) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return { department };
  } catch (error) {
    console.error("Could not fetch department: ", error);
    const err = getErrorMessage(error);
    throw err;
  }
};
