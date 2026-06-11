"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { FeeType } from "@/lib/validation";
import { useTransition } from "react";
import { toast } from "sonner";
import { createServiceAction } from "../_actions/create-service-action";
import { CreateServiceForm } from "../_forms/create-service-form";

export const RenderCreateServiceFormModal = () => {
  const { dialogs, onClose } = useGenericDialog();
  const [isPending, startTransition] = useTransition();

  const handleSubmission = (data: FeeType) => {
    startTransition(async () => {
      const { error, success } = await createServiceAction(data);

      if (error) {
        toast.error(error);
        return;
      } else if (success) {
        toast.success("service created");
        setTimeout(() => onClose("create-service"), 300);
      }
    });
  };

  return (
    <Dialog
      open={!!dialogs["create-service"]}
      onOpenChange={() => onClose("create-service")}>
      {!!dialogs["create-service"] && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Service</DialogTitle>
            <DialogDescription>
              Add a new service that requires payment here
            </DialogDescription>
          </DialogHeader>
          <>
            <CreateServiceForm
              onSubmitAction={handleSubmission}
              isPending={isPending}
            />
          </>
        </DialogContent>
      )}
    </Dialog>
  );
};
