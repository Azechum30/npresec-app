"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const updateItemsPerPage = async (itemsPerPage: number) => {
  try {
    const { user, hasPermission } = await getUserWithPermissions("edit:users");
    if (!user) return { error: "Kindly sign in to update your settings" };
    if (!hasPermission)
      return { error: "You do not have permission to update user settings" };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { itemsPerPage },
    });

    if (!updatedUser) {
      return { error: "Failed to update items per page" };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (e) {
    console.error("Failed to update items per page", e);
    Sentry.captureException(e);
    return { error: "Failed to update items per page" };
  }
};
