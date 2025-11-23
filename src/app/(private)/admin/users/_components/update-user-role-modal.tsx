"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateUserRoleForm } from "../_forms/update-user-role-form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useGetUser } from "../_hooks/use-get-user";
import { UserRoleUpdateType } from "@/lib/validation";
import { useTransition } from "react";
import { updateUserRole } from "../_actions/update-user-role";
import { toast } from "sonner";
import LoadingState from "@/components/customComponents/Loading";

export const UpdateUserRoleModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { fetchError, isFetchingUser, user } = useGetUser();
  const [isPending, startTransition] = useTransition();

  const defaultValues = user
    ? {
        userId: user.id,
        roleId: user.role?.id as string,
      }
    : undefined;

  console.log("Default values:", defaultValues);

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
        }, 100);
      }
    });
  };
  return (
    <>
      <Dialog
        open={dialogs["update-user-role"] === true ? true : false}
        onOpenChange={() => onClose("update-user-role")}>
        <DialogContent>
          {defaultValues ? (
            <>
              <DialogHeader>
                <DialogTitle>Update User Role</DialogTitle>
                <DialogDescription>
                  Kindly update the selected user's role and save it in
                  real-time
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
              <DialogHeader className="sr-only">
                <DialogTitle>Loading User data</DialogTitle>,
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <LoadingState />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
