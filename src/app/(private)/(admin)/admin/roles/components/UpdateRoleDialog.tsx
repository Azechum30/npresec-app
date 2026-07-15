/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { CreateRoleForm } from "@/app/(private)/(admin)/admin/roles/forms/CreateRoleForm";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { RoleType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateRoleMutationFn } from "../actions/tanstack-mutations";
import { getRoleQueryOptions } from "../actions/tanstack-queries";

export const UpdateRoleDialog = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useUpdateRoleMutationFn(id as string);

  const isOpen = !!dialogs["edit-role"];
  const validId = id ?? null;
  const { data } = useQuery({
    ...getRoleQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleRoleUpdate = async (values: RoleType) => {
    await Promise.try(async () => {
      await mutateAsync({ id: id as string, data: values });
      onClose("edit-role");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-role")}>
      <DialogContent>
        {isOpen && data && validId ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Role</DialogTitle>
              <DialogDescription>
                Kindly edit role and save in realtime
              </DialogDescription>
            </DialogHeader>
            <CreateRoleForm
              onSubmit={handleRoleUpdate}
              defaultValues={{
                name: data.name,
                permissions: data.permissions.map((p) => p.id),
              }}
              isPending={isPending}
              id={validId}
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
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
