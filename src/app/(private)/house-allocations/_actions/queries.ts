import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../(admin)/admin/staff/utils/get-query-key";
import { getStudentsWithoutHouseAllocations } from "./server";

export const studentsWithoutHouseAllocationsQueryOptions = queryOptions({
  queryKey: getQueryKey().student.all,
  queryFn: getStudentsWithoutHouseAllocations,
  placeholderData: keepPreviousData,
});
