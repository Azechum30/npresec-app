/** biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getDepartment } from "./get-department";
import { getServerSideProps } from "./getServerSideProps";

export const departmentsQueryOptions = queryOptions({
  queryKey: getQueryKey().department.all,
  queryFn: () => getServerSideProps(),
  select: (data) =>
    data.departments.sort((a, b) => a.name.localeCompare(b.name)),
  placeholderData: keepPreviousData,
});

export const getDepartmentQueryOptions = (departmentId: string) => {
  const queryClient = getQueryClient();
  return queryOptions({
    queryKey: getQueryKey(departmentId).department.single,
    queryFn: () => getDepartment(departmentId).then((data) => data.department),
    initialData: queryClient
      .getQueryData(departmentsQueryOptions.queryKey)
      ?.departments?.find((department) => department.id === departmentId),
  });
};
