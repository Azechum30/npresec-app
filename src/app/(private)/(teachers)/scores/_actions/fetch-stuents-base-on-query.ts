"use server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { getUserPermissions } from "@/lib/get-session";
import { StudentSelect } from "@/lib/types";
import { AssessmentType, Semester } from "@/generated/prisma/client";

export const fetchStudentBaseOnQueryAction = async (
  classId: string,
  courseId: string,
  semester: string,
  academicYear: string,
  assessmentType: string,
) => {
  try {
    const { hasPermission } = await getUserPermissions("view:students");
    if (!hasPermission) {
      return { error: "You do not have permission to view students" };
    }

    if (
      !classId ||
      !courseId ||
      !semester ||
      !academicYear ||
      !assessmentType
    ) {
      return { error: "All fields are required" };
    }

    const students = await prisma.student.findMany({
      where: {
        classId,
        grades: {
          none: {
            courseId,
            semester: semester as Semester,
            academicYear: parseInt(academicYear),
            assessmentType: assessmentType as AssessmentType,
          },
        },
      },
      select: StudentSelect,
    });

    return { students: students || [] };
  } catch (e) {
    console.error("Could not fetch students", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching students" };
  }
};
