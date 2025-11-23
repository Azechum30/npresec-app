"use server";

import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

export const fetchClasses = async (userId: string) => {
  try {
    // const permission = await hasPermissions("view:classes");
    // if (!permission) {
    //   return { error: "You are not authorized to view classes" };
    // }

    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      return { error: "Teacher not found" };
    }

    const classes = await prisma.class.findMany({
      where: { teachers: { some: { id: teacher.id } } },
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
    // const permission = await hasPermissions("view:courses");
    // if (!permission) {
    //   return { error: "You are not authorized to view courses" };
    // }

    const teacher = await prisma.teacher.findUnique({
      where: { userId },
    });

    if (!teacher) {
      return { error: "Teacher not found" };
    }

    const courses = await prisma.course.findMany({
      where: { teachers: { some: { id: teacher.id } } },
    });

    return { courses: courses || [] };
  } catch (e) {
    console.error("Could not fetch course", e);
    Sentry.captureException(e);
    return { error: "Could not fetch course" };
  }
};
