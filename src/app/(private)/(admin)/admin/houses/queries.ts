/** biome-ignore-all assist/source/organizeImports: reason */
import { getQueryClient } from "@/components/providers/get-query-client";
import { orpc } from "@/lib/orpc-react-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const housesQueryOptions = queryOptions({
  ...orpc.house.getHouses.queryOptions(),
  placeholderData: keepPreviousData,
  staleTime: Infinity,
});

export const getHouseQueryOptions = (houseId: string) => {
  const queryClient = getQueryClient();
  return queryOptions({
    ...orpc.house.getHouseById.queryOptions({ input: { id: houseId } }),
    initialData: () =>
      queryClient
        .getQueryData(housesQueryOptions.queryKey)
        ?.find((house) => house.id === houseId),
  });
};
