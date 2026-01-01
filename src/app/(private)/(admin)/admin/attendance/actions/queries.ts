"use server";
import "server-only";
import * as Sentry from "@sentry/nextjs";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { getUserPermissions } from "@/lib/get-session";
import { prisma } from "@/lib/prisma";
import { AttendanceSelect } from "@/lib/types";

export const getAttendance = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:attendance");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const attendance = await prisma.attendance.findMany({
      select: AttendanceSelect,
    });

    return { attendance: attendance ?? [] };
  } catch (e) {
    console.error("Could not fetch attendance data:", e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export const getSingleAttendance = async (id: string) => {
  try {
    const { hasPermission } = await getUserPermissions("view:attendance");
    if (!hasPermission) {
      return { error: "Permission denied!" };
    }

    const attendance = await prisma.attendance.findUnique({
      where: { id },
    });

    if (!attendance) {
      return { error: "Failed to fetch student attendance" };
    }

    return { attendance };
  } catch (e) {
    Sentry.captureException(e);
    console.error("Could not fetch student attendance", e);
    return { error: getErrorMessage(e) };
  }
};
