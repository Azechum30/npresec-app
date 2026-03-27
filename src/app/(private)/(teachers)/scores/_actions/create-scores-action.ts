"use server";
import { ASSESSMENT_WEIGHTS } from "@/lib/constants";
import { getAuthUser, getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { GradeSchema } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

export const createScoresAction = async (values: unknown) => {
  try {
    const { hasPermission } = await getUserPermissions("create:grades");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const user = await getAuthUser();

    if (!user) {
      return { error: "Unauthenticated" };
    }

    const { error, success, data } = GradeSchema.safeParse(values);

    if (!success || error) {
      const errorMessage = error.issues.map((e) => e.message).join("\n");
      return { error: errorMessage };
    }

    const now = new Date();

    const [teacher, timeline] = await Promise.all([
      prisma.staff.findUnique({
        where: { userId: user.id },
        select: { id: true },
      }),

      prisma.assessmentTimeline.findFirst({
        where: {
          assessmentType: data.assessmentType,
          semester: data.semester,
          academicYear: data.academicYear,
          courseId: data.courseId,
        },
        select: {
          endDate: true,
          startDate: true,
          assessmentType: true,
        },
      }),
    ]);

    if (!timeline)
      return { error: "No timeline has been set for this assessment mode" };

    if (now < timeline.startDate)
      return {
        error: `Score entry for this assesment mode opens on ${timeline.startDate.toLocaleDateString("en-GH")}. `,
      };

    if (now > timeline.endDate)
      return { error: "The deadline for entering this assessment has passed!" };
    if (!teacher) {
      return { error: "No teacher with this User ID found!" };
    }

    const finalWeight = ASSESSMENT_WEIGHTS[data.assessmentType];

    if (finalWeight === undefined) {
      return {
        error: "No weight defined for assessment type " + data.assessmentType,
      };
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
        weight: finalWeight,
        remarks,
        staffId: teacher.id,
      })),
    });

    if (result.count !== scores.length) {
      return { error: "Could not create scores" };
    }

    revalidatePath(
      `/scores?classID=${classId}&courseID=${courseId}&semester=${semester}&academicYear=${academicYear}&assessmentType=${assessmentType}`,
    );

    return { count: result.count };
  } catch (e) {
    console.error("Could not create scores", e);
    Sentry.captureException(e);
    return { error: "Something went wrong!" };
  }
};
