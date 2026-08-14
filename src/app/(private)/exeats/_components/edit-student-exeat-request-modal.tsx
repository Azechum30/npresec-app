/** biome-ignore-all assist/source/organizeImports:reason */
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
import type { ExeatFormValues } from "@/lib/validation";
import { useQuery } from "@tanstack/react-query";
import { useUpdateExeatRequestMutationFn } from "../_actions/mutations";
import { getStudentExeatRequestQueryOptions } from "../_actions/queries";
import { RequestExeatForm } from "../_forms/request-exeat-form";

export const EditStudentExeatRequestModal = () => {
  const { id, dialogs, onClose } = useGenericDialog();

  const { mutateAsync, isPending } = useUpdateExeatRequestMutationFn();

  const validId = id ?? null;
  const isOpen = !!dialogs["edit-exeat"];

  const { data } = useQuery({
    ...getStudentExeatRequestQueryOptions(validId as string),
    enabled: isOpen && !!validId,
  });

  const handleExeatRequestUpdate = async (values: ExeatFormValues) => {
    await Promise.try(async () => {
      await mutateAsync({ id: validId as string, ...values });
      onClose("edit-exeat");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("edit-exeat")}>
      <DialogContent>
        {data && isOpen && validId ? (
          <>
            <DialogHeader>
              <DialogTitle>Edit Exeat Request</DialogTitle>
              <DialogDescription>
                Edit the selected exeat request in realtime.
              </DialogDescription>
            </DialogHeader>
            <RequestExeatForm
              onSubmitAction={handleExeatRequestUpdate}
              id={validId}
              defaultValues={{
                ...data,
                departureDate: (data.departureDate as Date).toISOString().slice(0, 16),
                expectedReturnDate: (data.expectedReturnDate as Date).toISOString().slice(0, 16),
              }}
              isPending={isPending}
            />
          </>
        ) : (
          <>
            <DialogHeader className="sr-only">
              <DialogTitle>Data is Loading</DialogTitle>
              <DialogDescription>
                Please wait while data loads
              </DialogDescription>
            </DialogHeader>
            <ShowLoadingState />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
