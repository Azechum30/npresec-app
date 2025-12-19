"use client";

import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState, useTransition } from "react";
import { getPermission } from "../actions/queries";
import { PermissionResponseType } from "@/lib/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreatePermissionForm } from "../forms/create-permission-form";
import { Loader2 } from "lucide-react";
import { PermissionType } from "@/lib/validation";
import { UpdatePermission } from "../actions/mutations";

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
        {dialogs["edit-permission"] && !!id && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {!isPending && defaultValues
                  ? "Edit Permission"
                  : "Loading Data"}
              </DialogTitle>
              <DialogDescription>
                {!isPending && defaultValues
                  ? "Make changes to permission and save in realtime!"
                  : ""}
              </DialogDescription>
            </DialogHeader>
            {dialogs["edit-permission"] &&
              !!id &&
              (!isPending && defaultValues ? (
                <CreatePermissionForm
                  onSubmit={handleUpdate}
                  defaultValues={{ permissions: [defaultValues] }}
                  id={id}
                  isPending={isUpdatingPermission}
                />
              ) : (
                <div className="flex gap-2 justify-center items-center h-full">
                  <Loader2 className="size-8 animate-spin" />
                  <span>Loading permission data</span>
                </div>
              ))}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
