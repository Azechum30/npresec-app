/**biome-ignore-all assist/source/organizeImports: reason */
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
import type { PermissionType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdatePermissionMutationFn } from "../actions/tanstack-mutation";
import { getPermissionsQueryOptions } from "../actions/tanstack-queries";
import { CreatePermissionForm } from "../forms/create-permission-form";

export const EditPermissionModal = () => {
  const { dialogs, id, onClose } = useGenericDialog();
  const { isPending, mutateAsync } = useUpdatePermissionMutationFn(
    id as string,
  );

  const isOpen = !!dialogs["edit-permission"];
  const validId = id ?? null;
  const { data } = useQuery({
    ...getPermissionsQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleUpdate = async (permission: PermissionType) => {
    await Promise.try(async () => {
      await mutateAsync({
        id: validId as string,
        permissions: permission.permissions,
      });
      onClose("edit-permission");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-permission")}>
      <DialogContent>
        {isOpen && data && validId ? (
          <>
            <DialogHeader>
              <DialogTitle>Update Permission</DialogTitle>
              <DialogDescription>
                Kindly make changes to the selected permission and save it in
                real-time
              </DialogDescription>
            </DialogHeader>

            <CreatePermissionForm
              onSubmit={handleUpdate}
              defaultValues={{
                permissions: [
                  { name: data.name, description: data.description ?? "" },
                ],
              }}
              id={validId}
              isPending={isPending}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Loading Data</DialogTitle>
              <DialogDescription>Data is loading</DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
