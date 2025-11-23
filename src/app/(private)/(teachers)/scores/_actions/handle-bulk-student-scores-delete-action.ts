"use server";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { Prisma } from "../../../../../../prisma/generated/client";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { z } from "zod";

export const handleBulkStudentScoreDeleteAction = async (
  ids: Prisma.GradeWhereUniqueInput[] | string[],
  searchParams: {
    classID?: string;
    courseID?: string;
    semester?: string;
    academicYear?: string;
    assessmentType?: string;
  }
) => {
  try {
    const { hasPermission, user } =
      await getUserWithPermissions("delete:scores");

    if (!user) return { error: "Unauthenticated" };

    // if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = z.array(z.string()).safeParse(ids);

    if (!success || error) {
      const errMessage = error.errors.flatMap((e) => e.message).join(",");
      console.error(errMessage);
      return { error: errMessage };
    }

    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
    });
    if (!teacher) return { error: "Teacher not found" };

    const grades = await prisma.grade.deleteMany({
      where: { id: { in: data }, teacherId: teacher.id },
    });

    if (grades.count !== data.length) {
      console.error("Could not delete all the selected student scores");
      return { error: "Could not delete all the selected student scores" };
    }

    if (searchParams) {
      revalidatePath(
        `/scores?classID=${searchParams.classID}&courseID=${searchParams.courseID}&semester=${searchParams.semester}&academicYear=${searchParams.academicYear}&assessmentType=${searchParams.assessmentType}`
      );
    } else {
      revalidatePath("/scores");
    }

    return { deleteCount: grades.count };
  } catch (e) {
    console.error("Could not delete student scores", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while deleting student scores" };
  }
};
