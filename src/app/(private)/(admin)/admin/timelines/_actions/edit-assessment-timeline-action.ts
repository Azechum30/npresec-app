"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { AssessmentTimelineSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";

export const editAssessmentTimelineAction = async (
  id: string,
  values: unknown,
) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:timelines");
    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task.",
      };

    const validParam = id && typeof id === "string";

    if (!validParam) return { error: "Invalid Id provided" };

    const unverifiedData = AssessmentTimelineSchema.safeParse(values);

    if (!unverifiedData.success) {
      const errMessage = unverifiedData.error.errors
        .flatMap((e) => `${e.path[0]}: ${e.message}`)
        .join("\n");

      return { error: errMessage };
    }

    const timeline = await prisma.assessmentTimeline.update({
      where: { id },
      data: unverifiedData.data,
    });

    if (!timeline) return { error: "Failed to update record" };

    revalidateTag("assessment-timelines", "seconds");

    return { success: true };
  } catch (e) {
    console.error("Failed to update assessment timeline", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
