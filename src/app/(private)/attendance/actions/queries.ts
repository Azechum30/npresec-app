/**biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../(admin)/admin/staff/utils/get-query-key";
import { getAttendance, getSingleAttendance } from "./server-queries";

export const attendanceQueryOptions = (classId?: string) =>
  queryOptions({
    queryKey: getQueryKey().attendance.all,
    queryFn: () => getAttendance(classId),
    placeholderData: keepPreviousData,
  });

export const getAttendanceQueryOptions = (attendanceId: string) => {
  const queryClient = getQueryClient();
  return queryOptions({
    queryKey: getQueryKey(attendanceId).attendance.single,
    queryFn: () =>
      getSingleAttendance(attendanceId).then((data) => data.attendance),
    initialData: () =>
      queryClient
        .getQueryData(attendanceQueryOptions().queryKey)
        ?.attendance.find((a) => a.id === attendanceId),
  });
};
