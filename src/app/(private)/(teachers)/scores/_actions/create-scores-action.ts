"use server";
import { getAuthUser } from "@/lib/getAuthUser";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { GradeSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

export const createScoresAction = async (values: unknown) => {
  try {
    // const permission = await hasPermissions("create:scores");
    // if (!permission) {
    //   return { error: "Permission denied!" };
    // }

    const user = await getAuthUser();

    if (!user) {
      return { error: "Unauthenticated" };
    }

    const { error, success, data } = GradeSchema.safeParse(values);

    if (!success || error) {
      const errorMessage = error.errors.map((e) => e.message).join("\n");
      return { error: errorMessage };
    }

    const teacher = await prisma.staff.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });

    if (!teacher) {
      return { error: "No teacher with this User ID found!" };
    }

    const {
      classId,
      courseId,
      assessmentType,
      scores,
      maxScore,
      weight,
      semester,
      academicYear,
      remarks,
    } = data;

    const result = await prisma.grade.createMany({
      data: scores.map((score) => ({
        ...score,
        courseId,
        assessmentType: assessmentType,
        semester,
        academicYear,
        maxScore,
        weight,
        remarks,
        teacherId: teacher.id,
      })),
    });

    if (result.count !== scores.length) {
      return { error: "Could not create scores" };
    }

    revalidatePath(
      `/scores?classID=${classId}&courseID=${courseId}&semester=${semester}&academicYear=${academicYear}&assessmentType=${assessmentType}`
    );

    return { count: result.count };
  } catch (e) {
    console.error("Could not create scores", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};
