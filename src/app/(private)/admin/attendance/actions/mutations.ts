"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { hasPermissions } from "@/lib/hasPermission";
import {
  BulkAttendanceSchema,
  EditSingleStudentAttendanceSchema,
  SingleStudentAttendanceSchema,
} from "@/lib/validation";
import { prisma } from "@/lib/prisma";
import { Prisma } from "../../../../../../prisma/generated/client";
import { revalidatePath } from "next/cache";
import { generateAcademicYear } from "@/app/(private)/admin/attendance/utils/generateAcademicYear";

const semesterType = ["First", "Second"] as const;

export const createAttendance = async (values: unknown) => {
  try {
    const permission = await hasPermissions("create:attendance");

    if (!permission) {
      return { error: "Permission denied!" };
    }

    const unValidData = BulkAttendanceSchema.safeParse(values);

    if (!unValidData.success) {
      const zodError = unValidData.error.errors
        .map((err) => `${err.path[0]}, ${err.message}`)
        .join(" \n");

      return { error: zodError };
    }

    const { classId, date, semester, studentEntries } = unValidData?.data;

    const academicYear = generateAcademicYear(date);

    const result = await prisma.$transaction(
      studentEntries.map((entry) =>
        prisma.attendance.create({
          data: {
            classId,
            date,
            academicYear,
            semester: semester as (typeof semesterType)[number],
            studentId: entry.studentId,
            status: entry.status,
          },
        })
      )
    );

    if (!result.length) {
      return { error: "Could not record attendance" };
    }

    return { count: result.length };
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === "P2002") {
        const targetFields = err.meta?.target as string[];
        const errorMessage = targetFields.includes("classId")
          ? "Attendance has already been recorded for this class on the said date!"
          : "Attendance has already been recorded for this date!";
        return { error: errorMessage };
      }
    }

    Sentry.captureException(err);
    console.error("Could not record attendance", err);
    return { error: getErrorMessage(err) };
  } finally {
    revalidatePath("/attendance");
  }
};

export const createSingleAttendance = async (values: unknown) => {
  try {
    const permission = await hasPermissions("create:attendance");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const unValidData = SingleStudentAttendanceSchema.safeParse(values);
    if (!unValidData.success) {
      const zodError = unValidData.error.errors
        .map((err) => `${err.path[0]}, ${err.message}`)
        .join(" \n");
      return { error: zodError };
    }
    const { classId, date, semester, studentId, status } = unValidData?.data;

    const attendanceExist = await prisma.attendance.findFirst({
      where: {
        studentId,
        classId,
        date,
      },
    });

    if (attendanceExist) {
      return {
        error:
          "Attendance has already been recorded for this student on the said date!",
      };
    }
    const academicYear = generateAcademicYear(date);

    const attendance = await prisma.attendance.create({
      data: {
        classId,
        date,
        academicYear,
        studentId,
        status,
        semester: semester as (typeof semesterType)[number],
      },
    });

    if (!attendance) {
      return { error: "Could not record attendance" };
    }

    revalidatePath("/attendance");
    return { attendance };
  } catch (err) {
    Sentry.captureException(err);
    console.error("Could not record attendance", err);
    return { error: getErrorMessage(err) };
  }
};

export const updateAttendance = async (values: unknown) => {
  try {
    const permission = await hasPermissions("edit:attendance");
    if (!permission) {
      return { error: "Permission denied!" };
    }
    const unValidData = EditSingleStudentAttendanceSchema.safeParse(values);
    if (!unValidData.success) {
      const zodError = unValidData.error.errors
        .map((err) => `${err.path[0]}, ${err.message}`)
        .join(" \n");
      return { error: zodError };
    }
    const { data, id } = unValidData?.data;

    const attendance = await prisma.attendance.update({
      where: {
        id,
      },
      data: {
        ...data,
        semester: data.semester as (typeof semesterType)[number],
      },
    });

    if (!attendance) {
      return { error: "Could not update attendance" };
    }

    revalidatePath("/attendance");

    return { attendance };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not update attendance", e);
    return { error: getErrorMessage(e) };
  }
};

export const deleteAttendance = async (id: string) => {
  try {
    const permission = await hasPermissions("delete:attendance");
    if (!permission) {
      return { error: "Permission denied!" };
    }
    const attendance = await prisma.attendance.delete({
      where: {
        id,
      },
    });
    if (!attendance) {
      return { error: "Could not delete attendance" };
    }
    revalidatePath("/attendance");
    return { attendance };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not delete attendance", e);
    return { error: getErrorMessage(e) };
  }
};

export const deleteMultipleAttendance = async (ids: string[]) => {
  try {
    const permission = await hasPermissions("delete:attendance");
    if (!permission) {
      return { error: "Permission denied!" };
    }

    const attendance = await prisma.attendance.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
    if (!attendance) {
      return { error: "Could not delete attendance" };
    }
    revalidatePath("/attendance");
    return { count: attendance.count };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not delete attendance", e);
    return { error: getErrorMessage(e) };
  }
};
