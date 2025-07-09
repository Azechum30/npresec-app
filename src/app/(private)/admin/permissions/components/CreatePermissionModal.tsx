"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { CreatePermissionForm } from "../forms/create-permission-form";
import { useHandlePermissionCreation } from "../hooks/use-handle-permission-creation";

export const CreatePermissionModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { isPending, handlePermissionCreation } = useHandlePermissionCreation();

  return (
    <>
      <Dialog
        open={dialogs["create-permission"]}
        onOpenChange={() => onClose("create-permission")}>
        <DialogContent className="w-full max-h-[85vh] overflow-auto scrollbar-thin">
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
    </>
  );
};
