/** biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getAllUsersAction, getUserById } from "./get-all-users-action";

export const usersQueryOptions = queryOptions({
  queryKey: getQueryKey().user.all,
  queryFn: getAllUsersAction,
  placeholderData: keepPreviousData,
  select: (data) => data.users,
});

export const getUserQueryOptions = (userId: string) => {
  const queryclient = getQueryClient();
  return queryOptions({
    queryKey: getQueryKey(userId).user.single,
    enabled: !!userId,
    queryFn: () => getUserById(userId),
    initialData: () =>
      queryclient
        .getQueryData(usersQueryOptions.queryKey)
        ?.users.find((u) => u.id === userId),
  });
};
