"use server";
import { Prisma } from "@/generated/prisma/client";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { PermissionSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";
import "server-only";

import { getCachedPermissions } from "@/utils/get-cached-permissions";
import { getError } from "@/utils/get-error";
import { z } from "zod";

export const getPermissions = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:permissions");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const permissions = await getCachedPermissions();

    console.log("Available Permissions", permissions);

    return { permissions: permissions ?? [] };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not fetch permissions", e);
    return {
      error: getError(e),
    };
  }
};

export const getPermission = async (
  id: string | Prisma.PermissionWhereUniqueInput
) => {
  try {
    const { hasPermission } = await getUserPermissions("view:permissions");
    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = z
      .string({ required_error: "A valid ID is required!" })
      .cuid()
      .safeParse(id);
    if (!success) {
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
    return {
      error: getError(err),
    };
  }
};
