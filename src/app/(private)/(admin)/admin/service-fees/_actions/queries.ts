import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getServicesAction } from "./get-services-action";

export const servicesQueryOptions = queryOptions({
  queryKey: getQueryKey().service.all,
  queryFn: getServicesAction,
  placeholderData: keepPreviousData,
});
