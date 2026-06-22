/** biome-ignore-all assist/source/organizeImports: reason */
import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import { getStaffQueryOptions, staffQueryOptions } from "./queries";
import {
  bulkDeleteStaff,
  createStaff,
  deleteStaffRequest,
  updateStaff,
} from "./server";

export const useCreateStaffMutationFn = () =>
  useMutation({
    mutationFn: createStaff,
    meta: {
      invalidates: staffQueryOptions.queryKey,
      message: "staff successfully queued for processing",
    } satisfies MutationCacheType,
  });

export const useUpdateStaffMutationFn = (staffId: string) =>
  useMutation({
    mutationFn: updateStaff,
    meta: {
      invalidates: [
        staffQueryOptions.queryKey,
        getStaffQueryOptions(staffId).queryKey,
      ],
      message: "staff updated",
    } satisfies MutationCacheType,
  });

export const useDeleteStaffMutationFn = () =>
  useMutation({
    mutationFn: deleteStaffRequest,
    meta: {
      invalidates: [staffQueryOptions.queryKey],
      message: "staff deleted",
    } satisfies MutationCacheType,
  });

export const useDeleteStaffsMutationFn = () =>
  useMutation({
    mutationFn: bulkDeleteStaff,
    meta: {
      invalidates: [staffQueryOptions.queryKey],
      message: "staff deleted",
    } satisfies MutationCacheType,
  });
