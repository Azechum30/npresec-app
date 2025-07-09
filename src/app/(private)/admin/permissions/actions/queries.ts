"use server";
import "server-only";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { PermissionSelect } from "@/lib/types";

export const getPermissions = async () => {
  try {
    const permission = await hasPermissions("view:permissions");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const permissions = await prisma.permission.findMany({
      select: PermissionSelect,
    });

    if (!permissions) return { error: "No permissions found!" };

    return { permissions };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not fetch permissions", e);
    return { error: getErrorMessage(e) };
  }
};
