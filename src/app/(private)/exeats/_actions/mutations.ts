/** biome-ignore-all assist/source/organizeImports: reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { orpc } from "@/lib/orpc-react-query-client";
import { useMutation } from "@tanstack/react-query";

export const useProcessExeatRequestMutation = () =>
  useMutation(
    orpc.exeat.createExeatRequest.mutationOptions({
      meta: {
        invalidates: orpc.exeat.getExeatsRequest.key(),
        message: "exeat request successfully sent for review",
      } satisfies MutationCacheType,
    }),
  );

export const useUpdateExeatRequestMutationFn = () =>
  useMutation(
    orpc.exeat.updateExeatRequest.mutationOptions({
      meta: {
        invalidates: [
          orpc.exeat.getExeatsRequest.key(),
          orpc.exeat.getExeatRequest.key(),
        ],
        message: "student exeat request updated",
      } satisfies MutationCacheType,
    }),
  );
export const useDeleteExeatRequestMutationFn = () =>
  useMutation(
    orpc.exeat.deleteExeatRequest.mutationOptions({
      meta: {
        invalidates: orpc.exeat.getExeatsRequest.key(),
        message: "student exeat request deleted",
      } satisfies MutationCacheType,
    }),
  );
export const useDeleteExeatsRequestMutationFn = () =>
  useMutation(
    orpc.exeat.deleteExeatsRequest.mutationOptions({
      meta: {
        invalidates: orpc.exeat.getExeatsRequest.key(),
        message: "exeat request(s) deleted",
      } satisfies MutationCacheType,
    }),
  );
export const useApproveExeatRequestMutationFn = () =>
  useMutation(
    orpc.exeat.approveExeatRequest.mutationOptions({
      meta: {
        invalidates: [
          orpc.exeat.getExeatsRequest.key(),
          orpc.exeat.getExeatRequest.key(),
        ],
        message: "exeat duly approved!",
      } satisfies MutationCacheType,
    }),
  );
export const useConfirmExeatRequestMutationFn = () =>
  useMutation(
    orpc.exeat.confirmExeatDepartureOrReturnRequest.mutationOptions({
      meta: {
        invalidates: [
          orpc.exeat.getExeatsRequest.key(),
          orpc.exeat.getExeatRequest.key(),
        ],
        message: "exeat duly confirmed!",
      } satisfies MutationCacheType,
    }),
  );
