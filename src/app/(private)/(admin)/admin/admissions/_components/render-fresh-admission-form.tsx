"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { FreshAdmissionsType } from "@/lib/validation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createNewStudentAdmissionAction } from "../_actions/server-only-actions";
import { CreateANewAdmissionForm } from "../_forms/create-a-new-admission";

export const RenderFreshAdmissionFormModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (data: FreshAdmissionsType) => {
    startTransition(async () => {
      const response = await createNewStudentAdmissionAction(data);

      if (response.error) {
        toast.error(response.error);
        return;
      }

      if (response.success) {
        toast.success("Student added to placement list");
        setTimeout(() => onClose("new-admission"), 300);
      }
    });
  };

  return (
    <>
      <Dialog
        open={!!dialogs["new-admission"]}
        onOpenChange={() => onClose("new-admission")}>
        {!!dialogs["new-admission"] && (
          <DialogContent className="w-full md:min-w-2xl md:max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Admission</DialogTitle>
              <DialogDescription>
                Kindly fill the form below to create a new student admission!
              </DialogDescription>
            </DialogHeader>
            <CreateANewAdmissionForm
              onSubmitAction={handleSubmit}
              isPending={isPending}
            />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};
