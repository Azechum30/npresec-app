"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { StudentSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";

export const fetchStudentsAction = async (classId: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:students");
    if (!hasPermission) return { error: "Permission denied" };

    if (!classId) return { error: "Please select a class to view students" };

    const students = await prisma.student.findMany({
      where: { classId },
      select: StudentSelect,
    });

    // Return empty array instead of error when no students found
    return { students: students || [] };
  } catch (e) {
    console.error("Could not fetch students", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching students" };
  }
};
