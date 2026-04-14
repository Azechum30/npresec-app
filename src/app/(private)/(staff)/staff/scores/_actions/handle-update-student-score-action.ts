"use server";
import { prisma } from "@/lib/prisma";
import { GradeSelect } from "@/lib/types";
import { EditGradeSchema } from "@/lib/validation";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

export const handleUpdateStudentScoreAction = async (values: unknown) => {
  try {
    const { user, hasPermission } = await getUserWithPermissions("edit:grades");

    if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = EditGradeSchema.safeParse(values);

    if (!success || error) {
      console.error(error);
      const errorMessage = error.issues.flatMap((e) => e.message).join("\n");
      return { error: errorMessage };
    }

    const [staff, timeline] = await Promise.all([
      prisma.staff.findFirst({
        where: {
          userId: user?.id,
        },
        select: { id: true },
      }),

      prisma.assessmentTimeline.findFirst({
        where: {
          academicYear: data.dataValues.academicYear,
          semester: data.dataValues.semester,
          courseId: data.dataValues.courseId,
          assessmentType: data.dataValues.assessmentType,
        },
      }),
    ]);

    const now = new Date();

    if (!timeline)
      return { error: "No update timeline set for this assessment" };

    if (now < timeline.startDate)
      return {
        error: `Score updates is yet to be open on ${timeline.startDate}`,
      };

    if (now > timeline.endDate)
      return { error: "Time has elapsed for scores to be updated" };

    if (!staff) return { error: "You cannot update this student score" };

    const {
      id,
      dataValues: { classId, studentName, ...rest },
    } = data;

    const result = await prisma.grade.update({
      where: { id: id as string, staffId: staff.id },
      data: {
        ...rest,
      },
      select: GradeSelect,
    });

    if (!result) return { error: "Could not update student score" };
    revalidatePath("/scores");

    return { studentScore: result };
  } catch (e) {
    console.error("Could not update student score", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while updating student score" };
  }
};
