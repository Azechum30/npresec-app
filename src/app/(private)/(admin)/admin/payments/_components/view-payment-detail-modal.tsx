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
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { getServicePaymentByTransactionId } from "../../service-fees/_actions/get-service-payment-by-transaction-id";
import { PaymentDetails } from "../../service-fees/_components/payment-details";
import { TRenderPayments } from "./render-payments";

export const ViewPaymentDetailsModal = () => {
  const { dialogs, id, onClose } = useGenericDialog();
  const [paymentDetails, setPaymentDetails] = useState<
    TRenderPayments["payments"][number] | undefined
  >();

  useEffect(() => {
    if (!id || !dialogs["view-payment-details"]) return;

    startTransition(async () => {
      const { error, transaction } = await getServicePaymentByTransactionId(
        id as string,
      );

      if (error) {
        toast.error(error);
        return;
      }

      if (transaction) {
        setPaymentDetails({
          ...transaction,
          currency: transaction?.currency.toString(),
        });
      }
    });
  }, [id, dialogs]);

  return (
    <Dialog
      open={!!dialogs["view-payment-details"]}
      onOpenChange={() => onClose("view-payment-details")}>
      {!!dialogs["view-payment-details"] && !!id && !!paymentDetails ? (
        <DialogContent className="w-full md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Summary</DialogTitle>
            <DialogDescription>
              This shows a detail breakdown of the selected payment including
              the client who made the said payment.
            </DialogDescription>
          </DialogHeader>
          <PaymentDetails transaction={paymentDetails} />
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader className="sr-only">
            <DialogTitle>Loading</DialogTitle>
            <DialogDescription>Data is loading</DialogDescription>
          </DialogHeader>
          <>
            <ShowLoadingState />
          </>
        </DialogContent>
      )}
    </Dialog>
  );
};
