/** biome-ignore-all assist/source/organizeImports: reason */
import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { orpc } from "@/lib/orpc-react-query-client";
import { useMutation } from "@tanstack/react-query";
import { getQueryKey } from "../staff/utils/get-query-key";

export const useCreateHouseMutationFn = () =>
  useMutation(
    orpc.house.createHouse.mutationOptions({
      meta: {
        invalidates: [orpc.house.getHouses.key(), getQueryKey().staff.all],
        message: "house created",
      } satisfies MutationCacheType,
    }),
  );

export const useUpdateHouseMutationFn = () =>
  useMutation(
    orpc.house.updateHouse.mutationOptions({
      meta: {
        invalidates: [
          orpc.house.getHouses.key(),
          orpc.house.getHouseById.key(),
          getQueryKey().staff.all,
        ],
        message: "house updated",
      } satisfies MutationCacheType,
    }),
  );

export const useDeleteHouseMutationFn = () =>
  useMutation(
    orpc.house.deleteHouse.mutationOptions({
      meta: {
        invalidates: orpc.house.getHouses.key(),
        message: "house deleted",
      } satisfies MutationCacheType,
    }),
  );
export const useDeleteHousesMutationFn = () =>
  useMutation(
    orpc.house.bulkDeleteHouses.mutationOptions({
      meta: {
        invalidates: orpc.house.getHouses.key(),
        message: "house deleted",
      } satisfies MutationCacheType,
    }),
  );
