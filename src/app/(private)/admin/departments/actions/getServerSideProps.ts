"use server";

import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { DepartmentSelect } from "@/lib/types";
import { Prisma } from "../../../../../../prisma/generated/client";
import { getErrorMessage } from "@/lib/getErrorMessage";

export const getServerSideProps = async (codes?: string[]) => {
  try {
    const permissions = await hasPermissions("view:departments");

    if (!permissions) {
      return { error: "Permission denied!" };
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

    if (!departments) {
      return { error: "No row found!" };
    }

    return { departments };
  } catch (error) {
    console.error("Could not fetch departments", error);
    return getErrorMessage(error);
  }
};
