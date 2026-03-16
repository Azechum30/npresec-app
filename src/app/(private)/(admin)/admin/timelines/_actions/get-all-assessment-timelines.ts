"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import * as Sentry from "@sentry/nextjs";
import { getCachedTimelines } from "./get-cached-timelines";

export const getAllAssessmentTimelines = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:timelines");

    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task!",
      };

    const timelines = await getCachedTimelines();

    return { timelines: timelines ?? [] };
  } catch (e) {
    console.error("Failed to fetch assessment timelines: ", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
