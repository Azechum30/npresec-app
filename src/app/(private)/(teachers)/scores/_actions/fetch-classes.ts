"use server";

import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

export const fetchClasses = async (userId: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:classes");
    if (!hasPermission) {
      return { error: "You are not authorized to view classes" };
    }

    const teacher = await prisma.staff.findUnique({
      where: { userId },
    });

    if (!teacher) {
      return { error: "Teacher not found" };
    }

    const classes = await prisma.class.findMany({
      where: { staff: { some: { id: teacher.id } } },
    });

    return { classes: classes || [] };
  } catch (e) {
    console.error("Could not fetch classes", e);
    Sentry.captureException(e);
    return { error: "Could not fetch classes" };
  }
};

export const fetchCourse = async (userId: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:courses");
    if (!hasPermission) {
      return { error: "You are not authorized to view courses" };
    }

    const teacher = await prisma.staff.findUnique({
      where: { userId },
    });

    if (!teacher) {
      return { error: "Teacher not found" };
    }

    const courses = await prisma.course.findMany({
      where: { staff: { some: { id: teacher.id } } },
    });

    return { courses: courses || [] };
  } catch (e) {
    console.error("Could not fetch course", e);
    Sentry.captureException(e);
    return { error: "Could not fetch course" };
  }
};
