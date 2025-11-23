"use server";
import * as Sentry from "@sentry/nextjs";
import { prisma } from "@/lib/prisma";
import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { GradeSelect } from "@/lib/types";
import { revalidatePath } from "next/cache";

export const handleStudentScoreDeleteAction = async (id: string) => {
  try {
    const { hasPermission } = await getUserWithPermissions("delete:scores");
    // if (!hasPermission) return { error: "Permission denied" };

    const grade = await prisma.grade.delete({
      where: { id },
      select: GradeSelect,
    });

    if (!grade) return { error: "Student score not found" };
    revalidatePath("/scores");

    return { studentScore: grade };
  } catch (e) {
    console.error("Could not delete student score", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while deleting student score" };
  }
};
