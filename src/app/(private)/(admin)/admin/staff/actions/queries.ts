/** biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../utils/get-query-key";
import { getStaff, getStaffMember } from "./server";

export const staffQueryOptions = queryOptions({
  queryKey: getQueryKey().staff.all,
  queryFn: getStaff,
  select: (data) => data?.staff,
  placeholderData: keepPreviousData,
});

export const getStaffQueryOptions = (staffId: string) => {
  const queryClient = getQueryClient();
  return queryOptions({
    queryKey: getQueryKey(staffId).staff.single,
    queryFn: () => getStaffMember(staffId).then((data) => data.staff),
    initialData: () =>
      queryClient
        .getQueryData(staffQueryOptions.queryKey)
        ?.staff.find((st) => st.id === staffId),
  });
};
