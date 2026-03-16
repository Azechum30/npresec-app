"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

export const getAssessmentTimelineById = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:timelines");
    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task",
      };

    if (!id || typeof id !== "string") return { error: "Invalid Id provided" };

    const timeline = await prisma.assessmentTimeline.findUnique({
      where: { id },
    });

    if (!timeline) return { error: "No timeline found with the provided ID" };

    return { timeline };
  } catch (e) {
    console.error("Failed to fetch timeline", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
