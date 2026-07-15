/**biome-ignore-all assist/source/organizeImports: reason */
import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getRole, getRoles } from "./queries";

export const rolesQueryOptions = queryOptions({
  queryKey: getQueryKey().role.all,
  queryFn: getRoles,
  placeholderData: keepPreviousData,
  select: (data) => data.roles,
});

export const getRoleQueryOptions = (roleId: string) => {
  const queryClient = getQueryClient();

  return queryOptions({
    queryKey: getQueryKey(roleId).role.single,
    queryFn: () => getRole(roleId).then((data) => data.role),
    initialData: () =>
      queryClient
        .getQueryData(rolesQueryOptions.queryKey)
        ?.roles.find((role) => role.id === roleId),
    enabled: !!roleId,
  });
};
