"use server";
import "server-only";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getUserPermissions } from "@/lib/get-session";
import { PermissionSelect } from "@/lib/types";
import { Prisma } from "@/generated/prisma/client";

import { z } from "zod";

export const getPermissions = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:permissions");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const permissions = await prisma.permission.findMany({
      select: PermissionSelect,
      orderBy: { createdAt: "desc" },
    });

    if (!permissions) return { error: "No permissions found!" };

    return { permissions };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not fetch permissions", e);
    return { error: getErrorMessage(e) };
  }
};

export const getPermission = async (
  id: string | Prisma.PermissionWhereUniqueInput,
) => {
  try {
    const { hasPermission } = await getUserPermissions("view:permissions");
    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = z
      .string({ required_error: "A valid ID is required!" })
      .cuid()
      .safeParse(id);
    if (!success || error) {
      const message = error.errors
        .flatMap((e) => `${e.path[0]}: ${e.message}`)
        .join(",");
      return { error: message };
    }

    const permission = await prisma.permission.findUnique({
      where: { id: data },
      select: PermissionSelect,
    });

    if (!permission) return { error: "Permission not found!" };

    return { permission };
  } catch (err: any) {
    console.error("Could not fetch Permission:", err),
      Sentry.captureException(err);
    return { error: "Something went wrong!" };
  }
};
