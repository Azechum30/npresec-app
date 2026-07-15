/** biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { UserPermissionsFormType } from "@/lib/validation";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { permissionsQueryOptions } from "../../permissions/actions/tanstack-queries";
import { rolesQueryOptions } from "../../roles/actions/tanstack-queries";
import { useUpdateUserRolesPermissionsFn } from "../_actions/mutations";
import { getUserQueryOptions } from "../_actions/queries";
import { UpdateUserPermissionsForm } from "../_forms/update-user-permissions-form";

export const UpdateUserPermissionsDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useUpdateUserRolesPermissionsFn(
    id as string,
  );
  const isOpen = !!dialogs["update-user-permissions"];
  const validId = id ?? null;

  const [userQueryData, rolesQueryData, permissionsQueryData] = useQueries({
    queries: [
      {
        ...getUserQueryOptions(validId as string),
        enabled: isOpen && !!validId,
      },
      { ...rolesQueryOptions, enabled: isOpen && !!validId },
      { ...permissionsQueryOptions, enabled: isOpen && !!validId },
    ],
  });

  const roles = useMemo(() => {
    if (!rolesQueryData.data || !userQueryData.data) return [];

    return rolesQueryData.data
      .filter((r) => userQueryData.data.roles.some((ur) => ur.roleId === r.id))
      .map((r) => ({ ...r, name: r.name.replaceAll(/_/g, " ") }));
  }, [rolesQueryData.data, userQueryData.data]);

  const handleUpdateUserPermissions = (values: UserPermissionsFormType) => {
    Promise.try(async () => {
      await mutateAsync(values);
      onClose("update-user-permissions");
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => onClose("update-user-permissions")}>
      <DialogContent>
        {userQueryData.data &&
        rolesQueryData.data &&
        permissionsQueryData.data ? (
          <>
            <DialogHeader>
              <DialogTitle>Update User Permissions</DialogTitle>
              <DialogDescription>
                Update the permissions for the selected user. Kindly be informed
                that the permissions you assign to this user will be propagated
                across all users with the same role as the selected user.
              </DialogDescription>
            </DialogHeader>
            <UpdateUserPermissionsForm
              onSubmit={(values) => handleUpdateUserPermissions(values)}
              isPending={isPending}
              roles={roles}
              permissions={permissionsQueryData.data}
              defaultValues={{
                userId: userQueryData.data.id,
                roleId: userQueryData.data.roles.map((r) => r.roleId),
                permissions: userQueryData.data.roles.flatMap((r) =>
                  r.role.permissions.flatMap((p) => p.id),
                ),
              }}
              id={id}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Loading...</DialogTitle>
              <DialogDescription>
                Please wait while we load the user details.
              </DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
