"use server";

import { getUserWithPermissions } from "@/utils/get-user-with-permission";
import { Prisma } from "../../../../../../prisma/generated/client";
import * as Sentry from "@sentry/nextjs";
import { GradeSelect } from "@/lib/types";
import { prisma } from "@/lib/prisma";

export const getStudentScoreAction = async (
  id: Prisma.GradeWhereUniqueInput | string
) => {
  try {
    const { hasPermission } = await getUserWithPermissions("view:scores");
    // if (!hasPermission) return { error: "Permission denied" };

    const grade = await prisma.grade.findUnique({
      where: typeof id === "string" ? { id } : id,
      select: GradeSelect,
    });

    if (!grade) return { error: "Student score not found" };

    return { studentScore: grade };
  } catch (e) {
    console.error("Could not get student score", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while getting student score" };
  }
};
