import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { UpdateUserPermissionsForm } from "../_forms/update-user-permissions-form";
import { useGetUser } from "../_hooks/use-get-user";
import { toast } from "sonner";
import LoadingState from "@/components/customComponents/Loading";
import { useUpdateUserPermissions } from "../_hooks/use-update-user-permissions";
import { useEffect, useRef } from "react";

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
  }, [updateSuccess, isPending]);

  if (!isFetchingUser && fetchError) {
    return toast.error(fetchError);
  }

  if (updateError && !isPending) {
    return toast.error(updateError);
  }

  const defaultValues = user
    ? {
        userId: user.id,
        username: user.username,
        permissions:
          user.permissions
            .map((p) => p.id)
            .concat(user.role?.permissions.map((p) => p.id) || []) || [],
      }
    : undefined;

  return (
    <Dialog
      open={dialogs["update-user-permissions"]}
      onOpenChange={() => onClose("update-user-permissions")}>
      <DialogContent className="w-full  max-h-[85vh] overflow-auto scrollbar-thin">
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
          defaultValues={defaultValues as any}
        />
      </DialogContent>
    </Dialog>
  );
};
