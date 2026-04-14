"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath, revalidateTag, updateTag } from "next/cache";
import "server-only";

export const updateItemsPerPage = async (itemsPerPage: number) => {
  try {
    const { user, hasPermission } = await getUserPermissions("edit:users");
    if (!user) throw new ActionError(CUSTOM_ERRORS.AUTHENTICATION.message);

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { itemsPerPage },
    });

    if (!updatedUser) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    revalidatePath("/profile");
    revalidatePath("/profile/settings");
    revalidatePath("/(private)", "layout");
    revalidatePath("/(private)/(admin)", "layout");
    revalidatePath("/(private)/(staff)", "layout");

    updateTag("users-list");
    updateTag("placement-list");
    updateTag("staff");
    updateTag("students-list");
    updateTag("permissions-list");

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

    return { success: true };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
