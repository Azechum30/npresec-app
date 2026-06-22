/**biome-ignore-all assist/source/organizeImports: reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import { getQueryKey } from "../../(admin)/admin/staff/utils/get-query-key";
import { studentsQueryOptions } from "../../(admin)/admin/students/actions/queries";
import {
  createAttendance,
  createSingleAttendance,
  deleteAttendance,
  deleteMultipleAttendance,
  updateAttendance,
} from "./actions";
import { attendanceQueryOptions, getAttendanceQueryOptions } from "./queries";

export const useRecordAttendanceMutationFn = () =>
  useMutation({
    mutationFn: createAttendance,
    meta: {
      invalidates: [getQueryKey().attendance.all, getQueryKey().student.all],
      message: "class attendace recorded",
    } satisfies MutationCacheType,
  });
export const useRecordSingleAttendanceMutationFn = () =>
  useMutation({
    mutationFn: createSingleAttendance,
    meta: {
      invalidates: [
        studentsQueryOptions.queryKey,
        attendanceQueryOptions().queryKey,
      ],
      message: "student attendace recorded",
    } satisfies MutationCacheType,
  });

export const useUpdateAttendanceMutationFn = (attendanceId: string) =>
  useMutation({
    mutationFn: updateAttendance,
    meta: {
      invalidates: [
        studentsQueryOptions.queryKey,
        attendanceQueryOptions().queryKey,
        getAttendanceQueryOptions(attendanceId).queryKey,
      ],
      message: "student attendace updated",
    } satisfies MutationCacheType,
  });

export const useDeleteAttendanceMutationFn = () =>
  useMutation({
    mutationFn: deleteAttendance,
    meta: {
      invalidates: [
        studentsQueryOptions.queryKey,
        attendanceQueryOptions().queryKey,
      ],
      message: "attendance deleted",
    } satisfies MutationCacheType,
  });

export const useBulkDeleteAttendanceMutationFn = () =>
  useMutation({
    mutationFn: deleteMultipleAttendance,
    meta: {
      invalidates: [
        studentsQueryOptions.queryKey,
        attendanceQueryOptions().queryKey,
      ],
      message: "attendance deleted",
    } satisfies MutationCacheType,
  });
