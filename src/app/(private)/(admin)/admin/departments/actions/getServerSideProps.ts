"use server";

import type { Prisma } from "@/generated/prisma/client";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { DepartmentSelect } from "@/lib/types";

export const getServerSideProps = async (codes?: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("view:departments");

    if (!hasPermission) {
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);
    }

    let query: Prisma.DepartmentWhereInput = {};

    if (codes) {
      query = {
        code: { in: codes },
      };
    }

    const departments = await prisma.department.findMany({
      where: query,
      select: DepartmentSelect,
      orderBy: {
        createdAt: "desc",
      },
    });

    return { departments: departments || [] };
  } catch (error) {
    console.error("Could not fetch departments", error);
    const err = getErrorMessage(error);
    throw err;
  }
};
