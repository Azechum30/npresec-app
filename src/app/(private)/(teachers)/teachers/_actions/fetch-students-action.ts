"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { StudentSelect } from "@/lib/types";
import * as Sentry from "@sentry/nextjs";

export const fetchStudentsAction = async (classId: string) => {
  try {
    // const permission = await hasPermissions("view:students");
    // if (!permission) return { error: "Permission denied" };

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
