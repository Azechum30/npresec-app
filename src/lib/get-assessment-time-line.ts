"use server";

import * as Sentry from "@sentry/nextjs";

import { getErrorMessage } from "./getErrorMessage";
import { prisma } from "./prisma";
import { AssesessmentType, Semester } from "./validation";

export const getAssessmentTimeline = async (
  assessmentType: AssesessmentType,
  semester: (typeof Semester)[number],
  academicYear: number,
  courseId: string,
) => {
  try {
    const validParams =
      assessmentType &&
      typeof assessmentType === "string" &&
      semester &&
      typeof semester === "string" &&
      academicYear &&
      typeof academicYear === "number" &&
      courseId &&
      typeof courseId === "string";

    if (!validParams)
      return {
        error: "Invalid passed parameters. Kindly check your form's data",
      };

    const timeline = await prisma.assessmentTimeline.findFirst({
      where: {
        courseId,
        assessmentType,
        semester,
        academicYear,
      },
    });

    if (!timeline)
      return {
        error: "No entry timeline has been entered for this assessment.",
      };
    return { timeline };
  } catch (e) {
    console.error("Failed to fetch assessment timeline", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong",
    };
  }
};
