/** biome-ignore-all assist/source/organizeImports: reason */

import { getQueryClient } from "@/components/providers/get-query-client";
import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { authClient } from "@/lib/auth-client";
import { BanUserType } from "@/lib/validation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { permissionsQueryOptions } from "../../permissions/actions/tanstack-queries";
import { rolesQueryOptions } from "../../roles/actions/tanstack-queries";
import { staffQueryOptions } from "../../staff/actions/queries";
import { approveOrDisapproveLogin } from "./approve-or-disapprove-loggin";
import { createNewUserAction } from "./create-new-user";
import { deleteUserAction } from "./delete-user";
import { deleteUsersAction } from "./delete-users";
import { getUserQueryOptions, usersQueryOptions } from "./queries";
import { UpdateUserPermissions } from "./update-permissions";
import { updateUserRole } from "./update-user-role";

export const useUpdateUserRoles = (userId: string) =>
  useMutation({
    mutationFn: updateUserRole,
    meta: {
      invalidates: [
        usersQueryOptions.queryKey,
        getUserQueryOptions(userId).queryKey,
        staffQueryOptions.queryKey,
        rolesQueryOptions.queryKey,
      ],
      message: "user roles updated",
    } satisfies MutationCacheType,
  });

export const useUpdateUserRolesPermissionsFn = (userId: string) =>
  useMutation({
    mutationFn: UpdateUserPermissions,
    meta: {
      invalidates: [
        usersQueryOptions.queryKey,
        getUserQueryOptions(userId).queryKey,
        staffQueryOptions.queryKey,
        rolesQueryOptions.queryKey,
        permissionsQueryOptions.queryKey,
      ],
      message: "user role permissions updated",
    } satisfies MutationCacheType,
  });

export const useCreateUserWithRoleFn = () =>
  useMutation({
    mutationFn: createNewUserAction,
    meta: {
      invalidates: usersQueryOptions.queryKey,
      message: "user created",
    } satisfies MutationCacheType,
  });

export const useVerifyOrUnverifyEmailFn = (userId: string) =>
  useMutation({
    mutationFn: approveOrDisapproveLogin,
    meta: {
      invalidates: [
        usersQueryOptions.queryKey,
        getUserQueryOptions(userId).queryKey,
      ],
      message: "email verification status changed",
    } satisfies MutationCacheType,
  });
export const useDeleteUserMutationFn = () =>
  useMutation({
    mutationFn: deleteUserAction,
    meta: {
      invalidates: usersQueryOptions.queryKey,

      message: "user deleted",
    } satisfies MutationCacheType,
  });
export const useDeleteUsersMutationFn = () =>
  useMutation({
    mutationFn: deleteUsersAction,
    meta: {
      invalidates: usersQueryOptions.queryKey,

      message: "user(s) deleted",
    } satisfies MutationCacheType,
  });

export const useBanUserMutationFn = (userId: string) =>
  useMutation({
    mutationFn: (data: BanUserType) =>
      authClient.admin.banUser({
        userId: data.userId,
        banExpiresIn: Date.now() + Number(data.duration) * 1000,
        banReason: data.banReason,
      }),
    meta: {
      invalidates: [
        usersQueryOptions.queryKey,
        getUserQueryOptions(userId).queryKey,
      ],
      message: "user banned",
    } satisfies MutationCacheType,
  });
export const useUnBanUserMutationFn = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: (authUserId: string) =>
      authClient.admin.unbanUser({
        userId: authUserId,
      }),

    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: usersQueryOptions.queryKey }),
        queryClient.invalidateQueries({
          queryKey: getUserQueryOptions(variables).queryKey,
        }),
      ]);

      toast.success("user unbanned");
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useImpersonateUserMutationFn = () => {
  const queryClient = getQueryClient();
  return useMutation({
    mutationFn: async (userId: string) =>
      await authClient.admin.impersonateUser({
        userId,
      }),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: usersQueryOptions.queryKey }),
        queryClient.invalidateQueries({
          queryKey: getUserQueryOptions(variables).queryKey,
        }),
      ]);

      toast.success("user impersonation successful");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};

export const useStopImpersonatingUserMutationFn = (userId: string) =>
  useMutation({
    mutationFn: async () => await authClient.admin.stopImpersonating(),
    meta: {
      invalidates: [
        usersQueryOptions.queryKey,
        getUserQueryOptions(userId).queryKey,
      ],
      message: "user impersonation stopped",
    } satisfies MutationCacheType,
  });
