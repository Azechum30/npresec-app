/** biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { orpc } from "@/lib/orpc-react-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const studentsWithoutHouseAllocationsQueryOptions = (
  studentId?: string,
) => {
  return queryOptions({
    ...orpc.allocation.studentsWithAllocations.queryOptions({
      input: studentId,
    }),
    placeholderData: keepPreviousData,
  });
};

export const allocationsQueryOptions = (houseId?: string) =>
  queryOptions({
    ...orpc.allocation.getAllocations.queryOptions({
      input: { houseId: houseId as string },
    }),
    placeholderData: keepPreviousData,
  });

export const getAllocationQueryOptions = (allocationId: string) => {
  const queryClient = getQueryClient();

  return queryOptions({
    ...orpc.allocation.getAllocation.queryOptions({ input: allocationId }),
    initialData: () =>
      queryClient
        .getQueryData(allocationsQueryOptions().queryKey)
        ?.find((alloc) => alloc.id === allocationId),
  });
};
