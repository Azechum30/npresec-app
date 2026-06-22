/**biome-ignore-all assist/source/organizeImports: reason */
"use server";
import type { Prisma } from "@/generated/prisma/client";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { AttendanceSelect } from "@/lib/types";
import "server-only";

export const getAttendance = async (classId?: string) =>
  nextSafeAction(
    async () => {
      const queryOptions: Prisma.AttendanceWhereInput = {};

      if (classId) {
        queryOptions.classId = classId;
      }

      const attendance = await prisma.attendance.findMany({
        where: queryOptions,
        select: AttendanceSelect,
      });
      return { attendance: attendance ?? [] };
    },
    { permission: "view:attendance" },
  );

export const getSingleAttendance = async (id: string) =>
  nextSafeAction(
    async () => {
      const attendance = await prisma.attendance.findUnique({
        where: { id },
        select: AttendanceSelect,
      });
      if (!attendance) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
      return { attendance };
    },
    { permission: "view:attendance" },
  );
