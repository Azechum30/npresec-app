"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { AssessmentTimelineSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";
export const createAssessmentTimeline = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("create:timelines");

    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task",
      };

    const validData = AssessmentTimelineSchema.safeParse(values);

    if (!validData.success) {
      const errorMessage = validData.error.issues
        .flatMap((error) => `${error.path[0] as any}: ${error.message}`)
        .join("\n");

      return { error: errorMessage };
    }

    const result = await prisma.assessmentTimeline.create({
      data: validData.data,
    });

    if (!result) return { error: "Failed to create assessment timeline" };

    revalidateTag("assessment-timelines", "seconds");

    return { success: true };
  } catch (e) {
    console.error("Failed to create assessment timeline: ", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
