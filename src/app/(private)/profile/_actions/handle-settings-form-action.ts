"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { SettingsSchema } from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const handleSettingsFormAction = async (values: unknown) => {
  try {
    const { user, hasPermission } = await getUserWithPermissions("edit:users");
    if (!user) return { error: "Kindly sign in to update your settings" };
    if (!hasPermission)
      return { error: "You do not have permission to update user settings" };

    const { error, success, data } = SettingsSchema.safeParse(values);

    if (!success || error) {
      return { error: "Invalid form data", details: error.format() };
    }

    const updateUsertSettings = await prisma.user.update({
      where: { id: user.id },
      data: {
        subscribeToOurNewsLetter: data.subscribeToNewsletter,
        dateFormat: data.dateFormat,
        itemsPerPage: data.itemsPerPage,
        theme: data.theme,
        emailNotifications: data.emailNotifications,
        notificationFrequency: data.notificationFrequency,
        compactMode: data.compactMode,
        showTips: data.showTips,
      },
    });

    if (!updateUsertSettings) {
      return { error: "Failed to update user settings" };
    }

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return { success: true };
  } catch (e) {
    console.error("Failed to update user settings", e);
    Sentry.captureException(e);
    return { error: "Failed to update user settings" };
  }
};
