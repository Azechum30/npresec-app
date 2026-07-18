/** biome-ignore-all assist/source/organizeImports: reason */
import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { orpc } from "@/lib/orpc-react-query-client";
import { useMutation } from "@tanstack/react-query";

export const useCreateAllocationMutationFn = () =>
  useMutation(
    orpc.allocation.createAllocation.mutationOptions({
      meta: {
        invalidates: [
          orpc.allocation.getAllocations.key(),
          orpc.allocation.studentsWithAllocations.key(),
        ],
        message: "student successfully assigned.",
      } satisfies MutationCacheType,
    }),
  );

export const useUpdateAllocationMutation = () =>
  useMutation(
    orpc.allocation.updateAllocation.mutationOptions({
      meta: {
        invalidates: [
          orpc.allocation.getAllocations.key(),
          orpc.allocation.getAllocation.key(),
        ],
        message: "allocation updated",
      } satisfies MutationCacheType,
    }),
  );

export const useDeleteAllocationMutationFn = () =>
  useMutation(
    orpc.allocation.deleteAllocation.mutationOptions({
      meta: {
        invalidates: orpc.allocation.getAllocations.key(),
        message: "allocation deleted",
      } satisfies MutationCacheType,
    }),
  );

export const useDeleteAllocationsMutationFn = () =>
  useMutation(
    orpc.allocation.deleteAllocations.mutationOptions({
      meta: {
        invalidates: orpc.allocation.getAllocations.key(),
        message: "allocation(s) deleted",
      } satisfies MutationCacheType,
    }),
  );
