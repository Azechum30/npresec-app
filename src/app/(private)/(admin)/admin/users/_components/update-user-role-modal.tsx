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
import type { UserRoleUpdateType } from "@/lib/validation";
import { useQueries } from "@tanstack/react-query";
import { rolesQueryOptions } from "../../roles/actions/tanstack-queries";
import { useUpdateUserRoles } from "../_actions/mutations";
import { getUserQueryOptions } from "../_actions/queries";
import { UpdateUserRoleForm } from "../_forms/update-user-role-form";

export const UpdateUserRoleModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateUserRoles(id as string);

  const isOpen = !!dialogs["update-user-role"];
  const validId = id ?? null;

  const [rolesQueryData, userWithRoleQueryData] = useQueries({
    queries: [
      {
        ...rolesQueryOptions,
        enabled: isOpen && !!validId,
      },
      {
        ...getUserQueryOptions(validId as string),
        enabled: isOpen && !!validId,
      },
    ],
  });

  const handleRoleUpdate = (data: UserRoleUpdateType) => {
    Promise.try(async () => {
      await mutateAsync(data);
      onClose("update-user-role");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("update-user-role")}>
      <DialogContent>
        {rolesQueryData.data && userWithRoleQueryData.data ? (
          <>
            <DialogHeader>
              <DialogTitle>Update User Roles</DialogTitle>
              <DialogDescription className="text-justify">
                Update the roles for this user. Users can hold multiple roles
                based on their organizational responsibilities. Please review
                carefully before applying these changes, as they directly impact
                user access.
              </DialogDescription>
            </DialogHeader>

            <UpdateUserRoleForm
              onSubmit={handleRoleUpdate}
              defaultValues={{
                roleId: userWithRoleQueryData.data.roles.map((r) => r.roleId),
                userId: userWithRoleQueryData.data.id,
                roleType: "Organizational",
              }}
              roles={rolesQueryData.data}
              isPending={isPending}
              id={id}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Data Loads</DialogTitle>
              <DialogDescription>Data is Loading</DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
