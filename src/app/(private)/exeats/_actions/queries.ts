/** biome-ignore-all assist/source/organizeImports: reason */
import { getQueryClient } from "@/components/providers/get-query-client";
import { orpc } from "@/lib/orpc-react-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const studentsToAssignExeatQueryOptions = queryOptions({
  ...orpc.exeat.getStudentsToAssignExeatRequest.queryOptions(),
  placeholderData: keepPreviousData,
});

export const studentsExeatsRequestQueryOptions = queryOptions({
  ...orpc.exeat.getExeatsRequest.queryOptions(),
  placeholderData: keepPreviousData,
});

export const getStudentExeatRequestQueryOptions = (exeatId: string) => {
  const queryClient = getQueryClient();

  return queryOptions({
    ...orpc.exeat.getExeatRequest.queryOptions({ input: exeatId }),
    initialData: () =>
      queryClient
        .getQueryData(studentsExeatsRequestQueryOptions.queryKey)
        ?.find((exeat) => exeat.id === exeatId),
  });
};
