/** biome-ignore-all assist/source/organizeImports: reason */
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
import type { DepartmentType } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateDepartmentMutationFn } from "../actions/mutations";
import { getDepartmentQueryOptions } from "../actions/queries";
import CreateDepartment from "../forms/create-department";

export default function EditDepartment() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateDepartmentMutationFn(
    id as string,
  );

  const isOpen = !!dialogs["edit-department"];
  const validId = id ?? null;
  const { data } = useQuery({
    ...getDepartmentQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  async function handleUpdate(data: DepartmentType) {
    Promise.try(async () => {
      await mutateAsync({ ...data, id: validId as string });
      onClose("edit-department");
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-department")}>
      {validId && isOpen && data ? (
        <DialogContent className="max-h-full">
          <DialogHeader>
            <DialogTitle>Edit Department Data</DialogTitle>
            <DialogDescription>
              Kindly make changes and save your changes in real-time!
            </DialogDescription>
          </DialogHeader>
          <CreateDepartment
            id={validId}
            defaultValues={{
              code: data.code,
              name: data.name,
              createdAt: data.createdAt,
              description: data.description,
              headId: data.head?.id,
            }}
            onSubmitAction={handleUpdate}
            isPending={isPending}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading Data</DialogTitle>
            <DialogDescription>Loading Data</DialogDescription>
          </DialogHeader>
          <ShowLoadingState />
        </DialogContent>
      )}
    </Dialog>
  );
}
