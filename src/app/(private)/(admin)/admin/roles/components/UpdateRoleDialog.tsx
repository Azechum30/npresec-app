"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogTitle,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useEffect, useState } from "react";
import { getRole } from "../actions/queries";
import { toast } from "sonner";
import LoadingState from "@/components/customComponents/Loading";
import { CreateRoleForm } from "@/app/(private)/(admin)/admin/roles/forms/CreateRoleForm";
import { useHandleRoleUpdate } from "@/app/(private)/(admin)/admin/roles/hooks/use-handle-role-update";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Loader } from "lucide-react";

export const UpdateRoleDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const [role, setRole] = useState<{ name: string; permissions: string[] }>();
  const [error, setError] = useState<string>("");
  useEffect(() => {
    if (!dialogs["updateRole"] || !id) return;

    const fetchRole = async () => {
      const result = await getRole(id as string);
      if (result.error) {
        setError(result.error);
        setRole(undefined);
        return;
      }
      if (result.role) {
        setRole({
          name: result.role.name.trim().includes("_")
            ? result.role.name.trim().split("_").join(" ")
            : result.role.name,
          permissions: result.role.permissions?.length
            ? result.role.permissions.map((perm) => perm.id)
            : [],
        });
        setError("");
      }
    };

    fetchRole();
  }, [id, dialogs]);

  const { isPending, handleRoleUpdate } = useHandleRoleUpdate();

  if (error) {
    return toast.error(error);
  }

  return (
    <>
      <Dialog
        open={dialogs["updateRole"]}
        onOpenChange={() => onClose("updateRole")}>
        {dialogs["updateRole"] && !!id && (
          <DialogContent>
            {role ? (
              <>
                <DialogHeader>
                  <DialogTitle>Edit Role</DialogTitle>
                  <DialogDescription>
                    Kindly edit role and save in realtime
                  </DialogDescription>
                </DialogHeader>
                <CreateRoleForm
                  onSubmit={async (values) =>
                    await handleRoleUpdate({ id: id as string, data: values })
                  }
                  defaultValues={role}
                  isPending={isPending}
                  id={id}
                />
              </>
            ) : (
              <>
                <DialogHeader className="sr-only">
                  <DialogTitle>Loading Data</DialogTitle>
                  <DialogDescription>
                    Kindly wait while data loads...
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-2 items-center">
                  <Loader className="size-8 animate-spin" />
                  Loading data...
                </div>
              </>
            )}
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
