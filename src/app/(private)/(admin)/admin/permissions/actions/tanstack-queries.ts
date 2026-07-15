import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getPermissions } from "./queries";

export const permissionsQueryOptions = queryOptions({
  queryKey: getQueryKey().permission.all,
  queryFn: getPermissions,
  placeholderData: keepPreviousData,
  select: (data) => data.permissions,
});
