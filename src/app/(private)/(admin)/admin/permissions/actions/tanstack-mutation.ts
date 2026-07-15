/**biome-ignore-all assist/source/organizeImports: reason */
import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import {
  bulkDeletePermissions,
  createPermissions,
  deletePermission,
  UpdatePermission,
} from "./mutations";
import {
  getPermissionsQueryOptions,
  permissionsQueryOptions,
} from "./tanstack-queries";

export const useCreatePermissionMutationFn = () =>
  useMutation({
    mutationFn: createPermissions,
    meta: {
      invalidates: permissionsQueryOptions.queryKey,
      message: "permissions created",
    } satisfies MutationCacheType,
  });

export const useUpdatePermissionMutationFn = (permissionId: string) =>
  useMutation({
    mutationFn: UpdatePermission,
    meta: {
      invalidates: [
        permissionsQueryOptions.queryKey,
        getPermissionsQueryOptions(permissionId).queryKey,
      ],
      message: "permission updated",
    } satisfies MutationCacheType,
  });

export const useDeletePermissionMutationFn = () =>
  useMutation({
    mutationFn: deletePermission,
    meta: {
      invalidates: permissionsQueryOptions.queryKey,
      message: "permission deleted",
    } satisfies MutationCacheType,
  });

export const useDeletePermissionsMutationFn = () =>
  useMutation({
    mutationFn: bulkDeletePermissions,
    meta: {
      invalidates: permissionsQueryOptions.queryKey,
      message: "permissions deleted",
    } satisfies MutationCacheType,
  });
