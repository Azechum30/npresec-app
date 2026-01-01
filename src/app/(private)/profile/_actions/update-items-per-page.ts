"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { revalidateTag } from "next/cache";
import { revalidatePath } from "next/cache";

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
    revalidatePath("/(private)/(admin)/admin/students");
    revalidatePath("/(private)/(admin)/admin/staff");
    revalidatePath("/(private)/(admin)/admin/users");
    revalidatePath("/(private)/(admin)/admin/permissions");
    revalidatePath("/(private)/(admin)/admin/roles");
    revalidatePath("/(private)/(admin)/admin/departments");
    revalidatePath("/(private)/(admin)/admin/classes");
    revalidatePath("/(private)/(admin)/admin/courses");
    revalidatePath("/(private)/(admin)/admin/houses");
    revalidatePath("/(private)/(admin)/admin/board-of-governors");

    console.log("Cache revalidation completed for itemsPerPage update");
    return { success: true };
  } catch (e) {
    console.error("Failed to update items per page", e);
    Sentry.captureException(e);
    return { error: "Failed to update items per page" };
  }
};
