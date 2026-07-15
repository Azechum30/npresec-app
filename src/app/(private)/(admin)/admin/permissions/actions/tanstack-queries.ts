/**biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getPermission, getPermissions } from "./queries";

export const permissionsQueryOptions = queryOptions({
  queryKey: getQueryKey().permission.all,
  queryFn: getPermissions,
  placeholderData: keepPreviousData,
  select: (data) => data.permissions,
});

export const getPermissionsQueryOptions = (permissionId: string) => {
  const queryClient = getQueryClient();

  return queryOptions({
    queryKey: getQueryKey(permissionId).permission.single,
    queryFn: () => getPermission(permissionId),
    initialData: () =>
      queryClient
        .getQueryData(permissionsQueryOptions.queryKey)
        ?.permissions.find((perm) => perm.id === permissionId),
  });
};
