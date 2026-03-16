"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { isArrayOfString } from "@/utils/is-array-of-strings";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";

export const deleteTimelinesByIds = async (
  ids: string[],
): Promise<{ error?: string; success?: boolean; count?: number }> => {
  try {
    const { hasPermission } = await getUserPermissions("delete:timelines");

    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task",
      };

    if (!ids || ids.length === 0 || !isArrayOfString(ids))
      return { error: "Invalid IDs provided" };

    const { count } = await prisma.assessmentTimeline.deleteMany({
      where: { id: { in: ids } },
    });

    if (!count) return { error: "Failed to delete timelines" };

    revalidateTag("assessment-timelines", "seconds");

    return { success: true, count };
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
