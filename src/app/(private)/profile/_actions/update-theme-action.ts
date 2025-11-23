"use server";
import "server-only";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import * as Sentry from "@sentry/nextjs";

export const updateThemeAction = async (theme: "system" | "light" | "dark") => {
  try {
    const { user } = await getUserWithPermissions("edit:users");
    if (!user) return { error: "Kindly sign in to update your theme" };

    const validThemes = ["system", "light", "dark"];
    if (!validThemes.includes(theme)) {
      return { error: "Invalid theme value" };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { theme },
    });

    // Revalidate layout to update user context
    revalidatePath("/", "layout");

    return { success: true };
  } catch (e) {
    console.error("Failed to update theme", e);
    Sentry.captureException(e);
    return { error: "Failed to update theme" };
  }
};
