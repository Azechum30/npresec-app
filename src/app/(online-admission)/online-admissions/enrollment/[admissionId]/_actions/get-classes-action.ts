"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getExistingClasesAndDeparments = async (): Promise<{
  classes?: {
    id: string;
    name: string;
    departmentId: string | null;
  }[];
  courses?: {
    id: string;
    classes: {
      id: string;
      name: string;
    }[];
    title: string;
  }[];
  departments?: {
    id: string;
    name: string;
  }[];
  error?: string;
}> => {
  try {
    const [classes, departments, courses] = await Promise.all([
      prisma.class.findMany({
        where: { level: "Year_One" },
        select: { id: true, name: true, departmentId: true },
      }),
      prisma.department.findMany({
        select: { id: true, name: true },
      }),

      prisma.course.findMany({
        select: {
          id: true,
          title: true,
          classes: {
            select: { id: true, name: true },
          },
        },
      }),
    ]);

    return {
      classes: classes ?? [],
      courses: courses ?? [],
      departments: departments ?? [],
    };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
