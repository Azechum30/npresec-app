/**biome-ignore-all assist/source/organizeImports: reason */
import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getStudent, getStudents } from "./action";

export const studentsQueryOptions = queryOptions({
  queryKey: getQueryKey().student.all,
  queryFn: () => getStudents(),
  select: (data) => data?.students,
  placeholderData: keepPreviousData,
});

export const getStudentQueryOptions = (studentId: string) => {
  const queryClient = getQueryClient();
  return queryOptions({
    queryKey: getQueryKey(studentId).student.single,
    queryFn: () => getStudent(studentId).then((data) => data.student),
    initialData: () =>
      queryClient
        .getQueryData(studentsQueryOptions.queryKey)
        ?.students?.find((student) => student.id === studentId),
  });
};
