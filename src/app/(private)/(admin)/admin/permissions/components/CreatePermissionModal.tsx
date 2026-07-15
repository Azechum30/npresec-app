"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { PermissionType } from "@/lib/validation";
import { useCreatePermissionMutationFn } from "../actions/tanstack-mutation";
import { CreatePermissionForm } from "../forms/create-permission-form";

export const CreatePermissionModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { isPending, mutateAsync } = useCreatePermissionMutationFn();

  const isOpen = !!dialogs["create-permission"];
  const handlePermissionCreation = async (values: PermissionType) => {
    await Promise.try(async () => {
      await mutateAsync(values);
      onClose("create-permission");
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("create-permission")}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Create Permission
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mb-4">
            Create a new permission by filling out the form below.
          </DialogDescription>
        </DialogHeader>
        <CreatePermissionForm
          onSubmit={handlePermissionCreation}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
