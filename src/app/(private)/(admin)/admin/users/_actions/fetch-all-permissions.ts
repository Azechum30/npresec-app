"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { PermissionSelect } from "@/lib/types";

export const fetchAllPermissions = async () => {
  try {
    const { user, hasPermission } =
      await getUserPermissions("view:permissions");
    if (!hasPermission) return { error: "Permission denied!" };

    const permissions = await prisma.permission.findMany({
      select: PermissionSelect,
    });

    return { permissions: permissions || [] };
  } catch (e) {
    console.error("Could not fetch permissions", e);
    Sentry.captureException(e);
    return {
      error: "Something went wrong will trying to fetch the permissions",
    };
  }
};
