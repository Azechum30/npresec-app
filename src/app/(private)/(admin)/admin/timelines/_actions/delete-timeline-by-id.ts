"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";

export const deleteTimelineById = async (
  id: string,
): Promise<{ error?: string; success?: boolean }> => {
  try {
    const { hasPermission } = await getUserPermissions("delete:timelines");

    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task",
      };

    if (!id || typeof id !== "string") return { error: "Invalid ID provided" };

    const timeline = await prisma.assessmentTimeline.delete({
      where: { id },
    });

    if (!timeline) return { error: "Failed to delete timeline" };

    revalidateTag("assessment-timelines", "seconds");

    return { success: true };
  } catch (e) {
    console.error("Failed to delete timeline", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
