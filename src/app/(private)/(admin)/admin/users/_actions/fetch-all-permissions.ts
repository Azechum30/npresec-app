"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getCachedPermissions } from "@/utils/get-cached-permissions";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const fetchAllPermissions = async () => {
  try {
    const { user, hasPermission } =
      await getUserPermissions("view:permissions");
    if (!hasPermission) return { error: "Permission denied!" };

    const permissions = await getCachedPermissions();

    return { permissions: permissions || [] };
  } catch (e) {
    console.error("Could not fetch permissions", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(e)
          : "Something went wrong!",
    };
  }
};
