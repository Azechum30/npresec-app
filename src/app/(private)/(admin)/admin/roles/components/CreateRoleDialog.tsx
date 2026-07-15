/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { CreateRoleForm } from "@/app/(private)/(admin)/admin/roles/forms/CreateRoleForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { RoleType } from "@/lib/validation";
import { useCreateRoleMutationFn } from "../actions/tanstack-mutations";

export const CreateRoleDialog = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useCreateRoleMutationFn();

  const handleRoleCreation = async (data: RoleType) => {
    await Promise.try(async () => {
      await mutateAsync(data);
      onClose("create-role");
    });
  };

  const isOpen = !!dialogs["create-role"];

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-role")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>
          <DialogDescription>
            Kindly create a new role by filling the form and saving!
          </DialogDescription>
        </DialogHeader>

        <CreateRoleForm onSubmit={handleRoleCreation} isPending={isPending} />
      </DialogContent>
    </Dialog>
  );
};
