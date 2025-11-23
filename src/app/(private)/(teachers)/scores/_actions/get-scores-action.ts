"use server";
import { prisma } from "@/lib/prisma";
import { GradeSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";
import { getAuthUser } from "@/lib/getAuthUser";
import {
  AssessmentType,
  Semester,
} from "../../../../../../prisma/generated/client";

export const getScoresAction = async ({
  assessmentType,
  courseId,
  classId,
  semester,
  academicYear,
}: {
  assessmentType: AssessmentType;
  courseId: string;
  classId: string;
  semester: Semester;
  academicYear: number;
}) => {
  try {
    if (!assessmentType || !classId || !semester || !academicYear) {
      return {
        error:
          "You need provide a classId, semester, academicYear and assessmentType to fetch scores",
      };
    }
    const user = await getAuthUser();

    if (!user) {
      return { error: "Unauthenticated" };
    }

    const hasPermission =
      user.role?.permissions.some((p) => p.name === "view:scores") ||
      user.permissions.some((p) => p.name === "view:scores");

    // if (!hasPermission) {
    //   return { error: "Permission denied!" };
    // }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
    });

    if (!teacher) {
      return { error: "Teacher not found" };
    }

    const scores = await prisma.grade.findMany({
      where: {
        teacherId: teacher.id,
        semester,
        courseId,
        academicYear,
        assessmentType,
        student: {
          classId,
        },
      },
      select: GradeSelect,
      orderBy: [
        {
          student: { firstName: "asc" },
        },
        { student: { lastName: "asc" } },
      ],
    });

    return { scores: scores || [] };
  } catch (e) {
    console.error("Could not fetch scores", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching scores" };
  }
};
