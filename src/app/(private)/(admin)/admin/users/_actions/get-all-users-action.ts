"use server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { UserSelect } from "@/lib/types";
import "server-only";
import { getUserPermissions } from "@/lib/get-session";

export const getAllUsersAction = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:users");
    if (!hasPermission) {
      return { error: "Permission denied" };
    }

    const users = await prisma.user.findMany({
      select: UserSelect,
      orderBy: {
        username: "asc",
      },
    });

    return { users: users || [] };
  } catch (e) {
    console.error("Could not fetch users", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching users" };
  }
};
