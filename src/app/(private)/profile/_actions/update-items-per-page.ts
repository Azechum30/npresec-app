"use server";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { getError } from "@/utils/get-error";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath, revalidateTag } from "next/cache";
import "server-only";

export const updateItemsPerPage = async (itemsPerPage: number) => {
  console.log("updateItemsPerPage - New value:", itemsPerPage);
  try {
    const { user, hasPermission } = await getUserPermissions("edit:users");
    if (!user) return { error: "Kindly sign in to update your settings" };
    if (!hasPermission)
      return { error: "You do not have permission to update user settings" };

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { itemsPerPage },
    });

    console.log("Updated user itemsPerPage:", updatedUser.itemsPerPage);

    if (!updatedUser) {
      return { error: "Failed to update items per page" };
    }

    // Comprehensive cache revalidation
    // Note: revalidateTag calls removed due to argument mismatch issues

    // Revalidate all pages that might use the user's itemsPerPage setting
    revalidatePath("/profile");
    revalidatePath("/profile/settings");
    revalidatePath("/(private)", "layout");
    revalidatePath("/(private)/(admin)", "layout");
    revalidatePath("/(private)/(teachers)", "layout");

    // Revalidate specific admin pages that use data tables
    revalidateTag("users-list", "seconds");
    revalidateTag("permissions-list", "seconds");
    revalidatePath("/admin/students");
    revalidatePath("/admin/staff");
    revalidatePath("/admin/users");
    revalidatePath("/admin/permissions");
    revalidatePath("/admin/roles");
    revalidatePath("/admin/departments");
    revalidatePath("/admin/classes");
    revalidatePath("/admin/courses");
    revalidatePath("/admin/houses");
    revalidatePath("/admin/board-of-governors");

    console.log("Cache revalidation completed for itemsPerPage update");
    return { success: true };
  } catch (e) {
    console.error("Failed to update items per page", e);
    Sentry.captureException(e);
    return { error: getError(e) };
  }
};
