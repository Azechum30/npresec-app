"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
import "server-only";
import { z } from "zod";

export const deleteUserAction = async (id: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:users");
    if (!hasPermission) {
      return { error: "Permission denied" };
    }

    const { error, success, data } = z
      .object({ id: z.string().min(1) })
      .safeParse(id);

    if (!success || error) {
      const errorMessage = error.errors.flatMap((e) => e.message).join(",");
      return { error: errorMessage };
    }

    const userToDelete = await prisma.user.delete({
      where: { id: data.id },
    });

    if (!userToDelete) return { error: "Failed to delete user" };

    revalidateTag("users-list", "seconds");

    return { success: true };
  } catch (e) {
    console.error("An error occurred while trying to delete user", e);
    Sentry.captureException(e);
    return { error: "Something went wrong! Please try again" };
  }
};
