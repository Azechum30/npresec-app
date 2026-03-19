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
import { UserRoleUpdateType } from "@/lib/validation";
import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserRole } from "../_actions/update-user-role";
import { UpdateUserRoleForm } from "../_forms/update-user-role-form";
import { useGetUser } from "../_hooks/use-get-user";

export const UpdateUserRoleModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { user } = useGetUser();
  const [isPending, startTransition] = useTransition();

  const defaultValues = user
    ? {
        userId: user.id,
        roleId: user?.roles?.flatMap((rs) => rs.role.id),
      }
    : undefined;

  const handleRoleUpdate = (data: UserRoleUpdateType) => {
    startTransition(async () => {
      const { error, success } = await updateUserRole(data);

      if (error) {
        toast.error(error);
        return;
      }

      if (success) {
        toast.success("User role updated successfully");
        setTimeout(() => {
          onClose("update-user-role");
        }, 300);
      }
    });
  };
  return (
    <>
      <Dialog
        open={dialogs["update-user-role"] === true ? true : false}
        onOpenChange={() => onClose("update-user-role")}>
        <DialogContent>
          {defaultValues && dialogs["update-user-role"] && id ? (
            <>
              <DialogHeader>
                <DialogTitle>Update User Role</DialogTitle>
                <DialogDescription>
                  This allows you to update the role of the selected user.
                  Kindly be informed that a user can have more than one role
                  depending on what the user does in the organization. Think
                  critically before changing the user&apos;s role.
                </DialogDescription>
              </DialogHeader>

              <UpdateUserRoleForm
                onSubmit={(values) => handleRoleUpdate(values)}
                defaultValues={defaultValues}
                isPending={isPending}
                id={id}
              />
            </>
          ) : (
            <>
              <DialogHeader className="sr-only w-fit">
                <DialogTitle>Loading User data</DialogTitle>,
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <ShowLoadingState />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
