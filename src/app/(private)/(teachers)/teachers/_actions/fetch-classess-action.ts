"use server";
import * as Sentry from "@sentry/nextjs";
import { hasPermissions } from "@/lib/hasPermission";
import { prisma } from "@/lib/prisma";
import { ClassesSelect } from "@/lib/types";

export const fetchClassessAction = async (userId: string) => {
  try {
    // const permission = await hasPermissions("view:classes");
    // if (!permission) {
    //   return { error: "Permission denied" };
    // }

    if (!userId) {
      return { error: "User not found" };
    }

    const teacher = await prisma.staff.findUnique({
      where: { userId: userId },
    });

    if (!teacher) {
      return { error: "Teacher not found" };
    }

    const classes = await prisma.class.findMany({
      where: { staff: { some: { id: teacher.id } } },
      select: ClassesSelect,
    });

    if (!classes) {
      return { error: "No classes have been assigned to this teacher" };
    }

    return { classes };
  } catch (e) {
    console.error("Could not fetch classes", e);
    Sentry.captureException(e);
    return { error: "Something went wrong while fetching classes" };
  }
};
