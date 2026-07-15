/** biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import { orpc } from "@/lib/orpc-react-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";

export const roomsQueryOptions = (houseId?: string) =>
  queryOptions({
    ...orpc.room.getRooms.queryOptions({ input: { houseId } }),
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });

export const getRoomQueryOptions = (roomId: string) => {
  const queryClient = getQueryClient();

  return queryOptions({
    ...orpc.room.getRoomById.queryOptions({ input: { id: roomId } }),
    initialData: () =>
      queryClient
        .getQueryData(roomsQueryOptions().queryKey)
        ?.find((room) => room.id === roomId),
  });
};
