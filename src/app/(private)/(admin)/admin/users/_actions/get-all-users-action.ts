"use server";
import { getUserPermissions } from "@/lib/get-session";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import { getCachedUsers } from "../_utils/get-cached-users";

export const getAllUsersAction = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:users");
    if (!hasPermission) {
      return { error: "Permission denied" };
    }

    const users = await getCachedUsers();

    return { users: users || [] };
  } catch (e) {
    console.error("Could not fetch users", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? String(e)
          : "Something went wrong while fetching users",
    };
  }
};
