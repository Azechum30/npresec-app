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
  const wasUpdateErrorRef = useRef(false);
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

  useEffect(() => {
    const wasError = wasUpdateErrorRef.current;

    if (wasError && !isPending && updateError) {
      toast.error(updateError);
    }
    wasUpdateErrorRef.current = isPending;
  }, [isPending, updateError]);

  const wasFetchErrorRef = useRef(false);

  useEffect(() => {
    const wasFetchError = wasFetchErrorRef.current;

    if (wasFetchError && !isFetchingUser && fetchError) {
      toast.error(fetchError);
    }
    wasFetchErrorRef.current = isFetchingUser;
  }, [isFetchingUser, fetchError]);

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
      {defaultValues && dialogs["update-user-permissions"] && id ? (
        <DialogContent>
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
          <ShowLoadingState />
        </DialogContent>
      )}
    </Dialog>
  );
};
