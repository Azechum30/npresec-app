/**biome-ignore-all assist/source/organizeImports: reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import { createRole, updateRole } from "./mutations";
import { getRoleQueryOptions, rolesQueryOptions } from "./tanstack-queries";

export const useCreateRoleMutationFn = () =>
  useMutation({
    mutationFn: createRole,
    meta: {
      invalidates: rolesQueryOptions.queryKey,
      message: "role created",
    } satisfies MutationCacheType,
  });
export const useUpdateRoleMutationFn = (roleId: string) =>
  useMutation({
    mutationFn: updateRole,
    meta: {
      invalidates: [rolesQueryOptions.queryKey, getRoleQueryOptions(roleId)],
      message: "role update",
    } satisfies MutationCacheType,
  });
