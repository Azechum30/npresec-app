"use server";
import { prisma } from "@/lib/prisma";
import { GradeSelect } from "@/lib/types";
import { EditGradeSchema } from "@/lib/validation";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";

export const handleUpdateStudentScoreAction = async (values: unknown) => {
  try {
    const { user, hasPermission } = await getUserWithPermissions("edit:scores");

    // if (!hasPermission) return { error: "Permission denied" };

    const { error, success, data } = EditGradeSchema.safeParse(values);

    if (!success || error) {
      console.error(error);
      const errorMessage = error.errors.flatMap((e) => e.message).join("\n");
      return { error: errorMessage };
    }

    const {
      id,
      dataValues: { classId, studentName, ...rest },
    } = data;

    const result = await prisma.grade.update({
      where: { id: id as string },
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
