"use server";
import { AssessmentType, Semester } from "@/generated/prisma/client";
import { getAuthUser } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { GradeSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";

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

    const hasPermission = user.roles
      ?.flatMap((role) => role.role.permissions.map((p) => p.name))
      .some((p) => p === "view:grades");

    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const teacher = await prisma.staff.findUnique({
      where: { userId: user.id },
    });

    if (!teacher) {
      return { error: "Teacher not found" };
    }

    const scores = await prisma.grade.findMany({
      where: {
        staffId: teacher.id,
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
