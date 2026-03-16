"use server";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { BulkAssessmentTimelinesSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidateTag } from "next/cache";

export const bulkAssessmentTimelinesAction = async (
  values: unknown,
): Promise<{ error?: string; success?: boolean; count?: number }> => {
  try {
    const { hasPermission } = await getUserPermissions("create:timelines");

    if (!hasPermission)
      return {
        error: "You do not have sufficient permissions to perform this task.",
      };

    const unverifiedData = BulkAssessmentTimelinesSchema.safeParse(values);

    if (!unverifiedData.success) {
      const errMessage = unverifiedData.error.errors
        .flatMap((e) => `${e.path[0]}: ${e.message}`)
        .join("\n");
      return { error: errMessage };
    }

    const { data } = unverifiedData;

    const existingRecords = await prisma.assessmentTimeline.findMany({
      where: {
        courseId: { in: data.courseIds },
        semester: data.semester,
        academicYear: data.academicYear,
        assessmentType: data.assessmentType,
      },
      select: { courseId: true, assessmentType: true },
    });

    const courseMap = new Map(
      existingRecords.map((record) => [record.courseId, record.courseId]),
    );

    const noneDuplicatesCourseIds = data.courseIds.filter(
      (id) => !courseMap.has(id),
    );

    const { count } = await prisma.assessmentTimeline.createMany({
      data: noneDuplicatesCourseIds.map((id) => {
        return {
          courseId: id,
          assessmentType: data.assessmentType,
          semester: data.semester,
          academicYear: data.academicYear,
          startDate: data.startDate,
          endDate: data.endDate,
        };
      }),
    });

    if (!count) return { error: "Failed to set timelines" };

    revalidateTag("assessment-timelines", "seconds");

    return { success: true, count };
  } catch (error) {
    console.error("Failed to create assessment timelines", error);
    Sentry.captureException(error);

    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(error)
          : "Something went wrong!",
    };
  }
};
