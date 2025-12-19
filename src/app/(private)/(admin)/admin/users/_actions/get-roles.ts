"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { prisma } from "@/lib/prisma";

export const getRolesAction = async () => {
  try {
    const { hasPermission } = await getUserWithPermissions("view:roles");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }

    const roles = await prisma.role.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return { roles: roles || [] };
  } catch (e) {
    console.error("Could not fetch roles", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching roles" };
  }
};
