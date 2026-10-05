/** biome-ignore-all  assist/source/organizeImports:reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getClass, getClassesAction } from "./server-actions";

export const classQueryOptions = queryOptions({
  queryKey: getQueryKey().class.all,
  queryFn: getClassesAction,
  placeholderData: keepPreviousData,
});

export const getClassQueryOptions = (classId: string) => {
  const queryClient = getQueryClient();
  return queryOptions({
    queryKey: getQueryKey(classId).class.single,
    queryFn: () => getClass(classId),
    initialData: queryClient
      .getQueryData(classQueryOptions.queryKey)
      ?.find((cls) => cls.id === classId),
  });
};
