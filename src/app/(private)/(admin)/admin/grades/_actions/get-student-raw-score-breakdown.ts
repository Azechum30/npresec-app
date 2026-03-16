"use server";

import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { GradeSelect } from "@/lib/types";
import { Semester } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";

export const getStudentRawScoreBreakdown = async (
  studentId: string,
  semester: string,
  academicYear: number,
) => {
  try {
    const { hasPermission } = await getUserPermissions("view:grades");
    if (!hasPermission) return { error: "Permission denied!" };

    if (
      !studentId ||
      !(typeof studentId === "string") ||
      !semester ||
      !(typeof semester === "string") ||
      !academicYear ||
      !(typeof academicYear === "number")
    )
      return { error: "Invalid parameters received!" };

    const scoreDetails = await prisma.grade.findMany({
      where: {
        studentId,
        semester: semester as (typeof Semester)[number],
        academicYear,
      },
      select: GradeSelect,
    });

    return { scores: scoreDetails || [] };
  } catch (e) {
    console.error("Failed to fetch raw score detail", e);
    Sentry.captureException(e);
    return {
      error:
        process.env.NODE_ENV === "development"
          ? getErrorMessage(e)
          : "Something went wrong!",
    };
  }
};
