"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { Prisma } from "@/generated/prisma/client";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { prisma } from "@/lib/prisma";
import { UserSelect } from "@/lib/types";

export const getUserPermisions = async (
  id: Prisma.UserWhereUniqueInput | string
) => {
  try {
    const { hasPermission } = await getUserWithPermissions("view:users");
    if (!hasPermission) return { error: "Permission denied" };
    if (!id || typeof id !== "string") return { error: "Provide a valid ID" };

    const user = await prisma.user.findUnique({
      where: typeof id === "string" ? { id } : id,
      select: UserSelect,
    });

    if (!user) return { error: "No user found" };

    return { user: user };
  } catch (e) {
    console.error("Could not fetch user", e);
    Sentry.captureException(e);
    return { error: "Something went wrong, Please try again!" };
  }
};
