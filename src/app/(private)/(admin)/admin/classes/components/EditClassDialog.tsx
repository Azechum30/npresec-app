/** biome-ignore-all assist/source/organizeImports:reason */
"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { ClassesType } from "@/lib/validation";
import CreateClassForm from "../forms/create-class-form";

import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { useQuery } from "@tanstack/react-query";
import { useUpdateClassMutationFn } from "../actions/mutations";
import { getClassQueryOptions } from "../actions/queries";

export default function EditClassDialog() {
  const { id, dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useUpdateClassMutationFn(id as string);

  const isOpen = !!dialogs["edit-class"];
  const validId = id ?? null;
  const { data } = useQuery({
    ...getClassQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleSubmit = (values: ClassesType) =>
    Promise.try(async () => {
      await mutateAsync({ ...values, id: validId as string });
      onClose("edit-class");
    });

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-class")}>
      {data && isOpen ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Kindly make changes and save in realtime
            </DialogDescription>
          </DialogHeader>
          <CreateClassForm
            id={id}
            defaultValues={{
              level: data.level,
              name: data.name,
              code: data.code,
              createdAt: data.createdAt,
              departmentId: data.department?.id,
              maxCapacity: data.maxCapacity as number,
              staff: data.staff.map((staff) => staff.id),
              classTeacherId: data.classTeacherId ?? undefined,
            }}
            onSubmitAction={handleSubmit}
            isPending={isPending}
          />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading class data</DialogTitle>
            <DialogDescription>
              Please wait whilst data is being loaded
            </DialogDescription>
          </DialogHeader>
          <ShowLoadingState />
        </DialogContent>
      )}
    </Dialog>
  );
}
