"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { CreateRoleForm } from "@/app/(private)/(admin)/admin/roles/forms/CreateRoleForm";
import { useHandleRoleCreation } from "@/app/(private)/(admin)/admin/roles/hooks/use-handle-role-creation";

export const CreateRoleDialog = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { isPending, handleRoleCreation } = useHandleRoleCreation();
  return (
    <>
      <Dialog
        open={dialogs["createRole"]}
        onOpenChange={() => onClose("createRole")}>
        {dialogs["createRole"] && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Role</DialogTitle>
              <DialogDescription>
                Kindly create a new role by filling the form and saving!
              </DialogDescription>
            </DialogHeader>
            <>
              <CreateRoleForm
                onSubmit={(values) => handleRoleCreation(values)}
                isPending={isPending}
              />
            </>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
