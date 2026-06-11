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
import { CURRENCY, FEE_PAYMENT_STATUS, FeeType } from "@/lib/validation";
import { startTransition, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { getServiceById } from "../_actions/get-service-by-id";
import { updateServiceById } from "../_actions/update-service-by-Id";
import { CreateServiceForm } from "../_forms/create-service-form";

export const EditServiceModal = () => {
  const { dialogs, onClose, id } = useGenericDialog();
  const [isPending, startUpdateTransition] = useTransition();
  const [service, setService] = useState<
    | {
        id: string;
        academicYear: string;
        name: string;
        price: string;
        currency: CURRENCY;
        count: number;
        capacity: number | null;
        status: FEE_PAYMENT_STATUS;
        deadline: Date;
      }
    | undefined
  >();

  useEffect(() => {
    if (!id || !dialogs["edit-service"]) return;

    startTransition(async () => {
      const { error, service } = await getServiceById(id as string);

      if (error) {
        toast.error(error);
        return;
      }

      if (service) {
        setService({
          ...service,
          currency: service.currency as CURRENCY,
          status: service.status as FEE_PAYMENT_STATUS,
        });
      }
    });
  }, [id, dialogs]);

  const handleServiceUpdate = (values: FeeType) => {
    startUpdateTransition(async () => {
      const { error, success } = await updateServiceById({
        id: id as string,
        ...values,
      });

      if (error) {
        toast.error(error);
        return;
      } else if (success) {
        toast.success("fee service updated!");
        onClose("edit-service");
      }
    });
  };
  return (
    <Dialog
      open={!!dialogs["edit-service"]}
      onOpenChange={() => onClose("edit-service")}
      modal>
      {dialogs["edit-service"] && id && service ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>
              Make changes to the service and save in realtime!
            </DialogDescription>
          </DialogHeader>
          <>
            <CreateServiceForm
              onSubmitAction={handleServiceUpdate}
              isPending={isPending}
              id={id}
              defaultValues={{
                ...service,
                price: String(service.price),
                capacity: service.capacity ?? 0,
                status: service.status as FEE_PAYMENT_STATUS,
                academicYear: service.academicYear,
                currency: service.currency,
                deadline: service.deadline,
                name: service.name,
              }}
            />
          </>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading</DialogTitle>
            <DialogDescription>Data is londing</DialogDescription>
          </DialogHeader>
          <ShowLoadingState />
        </DialogContent>
      )}
    </Dialog>
  );
};
