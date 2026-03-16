"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { UpdateUserPermissionsForm } from "../_forms/update-user-permissions-form";
import { useGetUser } from "../_hooks/use-get-user";
import { useUpdateUserPermissions } from "../_hooks/use-update-user-permissions";

export const UpdateUserPermissionsDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const { fetchError, isFetchingUser, user } = useGetUser();
  const { handleUpdateUserPermissions, isPending, updateError, updateSuccess } =
    useUpdateUserPermissions();

  const prevUpdateSuccessRef = useRef(false);
  useEffect(() => {
    const wasUpdateSuccess = prevUpdateSuccessRef.current;
    if (wasUpdateSuccess && !isPending && updateSuccess) {
      toast.success("User permissions updated successfully");
      setTimeout(() => {
        onClose("update-user-permissions");
      }, 100);
    }
    prevUpdateSuccessRef.current = isPending;
  }, [updateSuccess, isPending, onClose]);

  if (!isFetchingUser && fetchError) {
    return toast.error(fetchError);
  }

  if (updateError && !isPending) {
    return toast.error(updateError);
  }

  const defaultValues = user
    ? {
        userId: user.id,
        roleId: user.roles?.flatMap((r) => r.roleId),
        permissions:
          user.roles?.flatMap((rs) => rs.role.permissions.map((p) => p.id)) ??
          [],
      }
    : undefined;

  return (
    <Dialog
      open={dialogs["update-user-permissions"]}
      onOpenChange={() => onClose("update-user-permissions")}>
      {defaultValues ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Permissions</DialogTitle>
            <DialogDescription>
              Update the permissions for the user by selecting the permissions
              from the list below.
            </DialogDescription>
          </DialogHeader>
          <UpdateUserPermissionsForm
            onSubmit={(values) => handleUpdateUserPermissions(values)}
            isPending={isPending}
            id={id}
            defaultValues={defaultValues}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading...</DialogTitle>
            <DialogDescription>
              Please wait while we load the user details.
            </DialogDescription>
          </DialogHeader>
          <div className="w-full h-full flex justify-center items-center">
            <Loader2 className="size-6 animate-spin" />
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
