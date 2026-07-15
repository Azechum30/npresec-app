/** biome-ignore-all assist/source/organizeImports: reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { orpc } from "@/lib/orpc-react-query-client";
import { useMutation } from "@tanstack/react-query";

export const useCreateRoomMutationFn = () =>
  useMutation(
    orpc.room.createRoom.mutationOptions({
      meta: {
        invalidates: [orpc.room.getRooms.key(), orpc.house.getHouses.key()],
        message: "room created",
      } satisfies MutationCacheType,
    }),
  );

export const useUpdateRoomMutationFn = () =>
  useMutation(
    orpc.room.updateRoomById.mutationOptions({
      meta: {
        invalidates: [
          orpc.room.getRooms.key(),
          orpc.room.getRoomById.key(),
          orpc.house.getHouses.key(),
        ],
        message: "room updated",
      } satisfies MutationCacheType,
    }),
  );
export const useDeleteRoomMutationFn = () =>
  useMutation(
    orpc.room.deleteRoomById.mutationOptions({
      meta: {
        invalidates: [orpc.room.getRooms.key(), orpc.house.getHouses.key()],
        message: "room deleted",
      } satisfies MutationCacheType,
    }),
  );
export const useDeleteRoomsMutationFn = () =>
  useMutation(
    orpc.room.deleteRoomsByIds.mutationOptions({
      meta: {
        invalidates: [orpc.room.getRooms.key(), orpc.house.getHouses.key()],
        message: "room deleted",
      } satisfies MutationCacheType,
    }),
  );
