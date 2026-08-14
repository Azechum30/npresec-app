/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import type { ExeatFormValues } from "@/lib/validation";
import { useProcessExeatRequestMutation } from "../_actions/mutations";
import { RequestExeatForm } from "../_forms/request-exeat-form";

export const RenderStudentExeatRequest = () => {
  const { dialogs, onClose } = useGenericDialog();
  const { mutateAsync, isPending } = useProcessExeatRequestMutation();

  const isOpen = !!dialogs["request-exeat"];

  const handleExeatRequestProcessing = async (values: ExeatFormValues) => {
    await Promise.try(async () => {
      await mutateAsync(values);
      onClose("request-exeat");
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose("request-exeat")}>
      <DialogContent>
        <DialogTitle>Request a new Exeat</DialogTitle>
        <DialogDescription>
          Fill the form below to request a new exeat
        </DialogDescription>
        <RequestExeatForm
          onSubmitAction={handleExeatRequestProcessing}
          isPending={isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
