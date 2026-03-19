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
import { PermissionResponseType } from "@/lib/types";
import { PermissionType } from "@/lib/validation";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { UpdatePermission } from "../actions/mutations";
import { getPermission } from "../actions/queries";
import { CreatePermissionForm } from "../forms/create-permission-form";

export const EditPermissionModal = () => {
  const { dialogs, id, onClose } = useGenericDialog();
  const [defaultValues, setDefaultValues] = useState<
    Pick<PermissionResponseType, "id" | "name"> | undefined
  >();

  const [isPending, startTransition] = useTransition();
  const [isUpdatingPermission, startUpdatingPermission] = useTransition();

  useEffect(() => {
    if (!id || !dialogs["edit-permission"]) return;

    startTransition(async () => {
      const { error, permission } = await getPermission(id);
      if (error) {
        toast.error(error || "Something went wrong!");
        return;
      } else {
        setDefaultValues(permission);
      }
    });
  }, [id, dialogs]);

  const handleUpdate = (permission: PermissionType) => {
    startUpdatingPermission(async () => {
      const { error, success } = await UpdatePermission({
        ...permission,
        id: id as string,
      });
      if (error) {
        toast.error(error || "Something went wrong!");
        return;
      } else if (success) {
        toast.success("Permission updated sucessfully");
        setTimeout(() => {
          onClose("edit-permission");
          setDefaultValues(undefined);
        }, 500);
      }
    });
  };

  return (
    <>
      <Dialog
        open={dialogs["edit-permission"] && !!id}
        onOpenChange={(open) => {
          if (!open) setDefaultValues(undefined);
          onClose("edit-permission");
        }}>
        {dialogs["edit-permission"] && !!id && defaultValues ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Permission</DialogTitle>
              <DialogDescription>
                Kindly make changes to the selected permission and save it in
                real-time
              </DialogDescription>
            </DialogHeader>

            <CreatePermissionForm
              onSubmit={handleUpdate}
              defaultValues={{ permissions: [defaultValues] }}
              id={id}
              isPending={isUpdatingPermission}
            />
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader className="sr-only">
              <DialogTitle>Loading Data</DialogTitle>
              <DialogDescription>Data is loading</DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
