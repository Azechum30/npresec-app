/**biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { generateAcademicYear } from "@/app/(private)/attendance/utils/generateAcademicYear";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { AttendanceSelect } from "@/lib/types";
import {
  BulkAttendanceSchema,
  EditSingleStudentAttendanceSchema,
  SingleStudentAttendanceSchema,
} from "@/lib/validation";
import { revalidateTag } from "next/cache";
import "server-only";
import { getQueryKey } from "../../(admin)/admin/staff/utils/get-query-key";
import { getSingleAttendance } from "./server-queries";

const semesterType = ["First", "Second"] as const;

export const createAttendance = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const parsed = BulkAttendanceSchema.safeParse(values);
      if (!parsed.success) throw parsed.error;

      const { classId, date, semester, studentEntries } = parsed.data;
      const academicYear = generateAcademicYear(date);

      // FIX: Use AND to check for exact conflicts
      const existingRecords = await prisma.attendance.findMany({
        where: {
          classId,
          semester: semester as (typeof semesterType)[number],
          academicYear,
          date: date,
          studentId: { in: studentEntries.map((s) => s.studentId) },
        },
      });

      if (existingRecords.length > 0) {
        throw new ActionError(
          "Attendance records already exist for one or more students in this class for the selected date/semester.",
        );
      }

      const result = await prisma.attendance.createMany({
        data: studentEntries.map((entry) => ({
          classId,
          date,
          academicYear,
          semester: semester as (typeof semesterType)[number],
          studentId: entry.studentId,
          status: entry.status,
        })),
        skipDuplicates: true,
      });

      revalidateTag(getQueryKey().student.all[0], "seconds");

      return { count: result.count };
    },
    { permission: "create:attendance" },
  );

export const createSingleAttendance = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const parsed = SingleStudentAttendanceSchema.safeParse(values);
      if (!parsed.success) throw parsed.error;
      const { classId, date, semester, studentId, status } = parsed.data;
      const academicYear = generateAcademicYear(date);

      const duplicate = await prisma.attendance.findFirst({
        where: {
          AND: [
            { studentId: studentId },
            { classId: classId },
            { academicYear: academicYear },
            { date: date },
            { semester: semester as (typeof semesterType)[number] },
          ],
        },
      });

      if (duplicate)
        throw new ActionError(
          "An attendance record already exist for this student",
        );

      const attendance = await prisma.attendance.create({
        data: {
          classId,
          date,
          academicYear,
          studentId,
          status,
          semester: semester as (typeof semesterType)[number],
        },
        select: AttendanceSelect,
      });
      revalidateTag(getQueryKey().student.all[0], "seconds");
      return { attendance };
    },
    { permission: "create:attendance" },
  );

export const updateAttendance = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const parsed = EditSingleStudentAttendanceSchema.safeParse(values);

      if (!parsed.success) throw parsed.error;
      const { data, id } = parsed.data;

      const attendance = await prisma.attendance.update({
        where: {
          id,
        },
        data: {
          ...data,
          semester: data.semester as (typeof semesterType)[number],
        },
      });

      revalidateTag(getQueryKey().student.all[0], "seconds");
      revalidateTag(
        getQueryKey(attendance.studentId).student.single[1],
        "seconds",
      );

      return { attendance };
    },
    { permission: "edit:attendance" },
  );

export const deleteAttendance = async (id: string) =>
  nextSafeAction(
    async () => {
      const existing = await getSingleAttendance(id);

      if (!existing) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

      const attendance = await prisma.attendance.delete({
        where: {
          id,
        },
      });

      revalidateTag(getQueryKey().student.all[0], "seconds");

      return { attendance };
    },
    { permission: "delete:attendance" },
  );

export const deleteMultipleAttendance = async (ids: string[]) =>
  nextSafeAction(
    async () => {
      const existingAttendance = await prisma.attendance.findMany({
        where: { id: { in: ids } },
        select: { id: true },
      });

      const existingIds = ids.filter((a) =>
        existingAttendance.some((at) => at.id === a),
      );

      if (existingIds.length === 0)
        throw new ActionError("No attendance record matched the provided Ids");

      const attendance = await prisma.attendance.deleteMany({
        where: {
          id: {
            in: existingIds,
          },
        },
      });
      revalidateTag(getQueryKey().student.all[0], "seconds");
      return { count: attendance.count };
    },
    { permission: "delete:attendance" },
  );
