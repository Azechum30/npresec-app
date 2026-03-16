"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getCachedRoles } from "@/utils/get-cached-roles";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getRolesAction = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:roles");
    if (!hasPermission) {
      console.error("Permission denied");
      return { error: "Permission denied" };
    }

    const roles = await getCachedRoles();

    return { roles: roles || [] };
  } catch (e) {
    console.error("Could not fetch roles", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(e)
          : "Something went wrong!",
    };
  }
};
