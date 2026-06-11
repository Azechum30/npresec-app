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
import { CURRENCY } from "@/lib/validation";
import { startTransition, useEffect, useState } from "react";
import { toast } from "sonner";
import { TRenderPayments } from "../../payments/_components/render-payments";
import { getServicePaymentByTransactionId } from "../_actions/get-service-payment-by-transaction-id";
import { PaymentDetails } from "./payment-details";

export type TTransaction = {
  amount: string;
  transactionFee: string;
  metadata: {
    studentId: string;
    name: string;
    serviceName: string;
  };
  id: string;
  orderId: string | null;
  transactionId: bigint | null;
  reference: string | null;
  channel: string | null;
  ipAddress: string | null;
  cardType: string | null;
  bank: string | null;
  brand: string | null;
  accountName: string | null;
  ReceiverAccountNumber: string | null;
  ReceiverBank: string | null;
  customerPhoneNumber: string | null;
  customerCode: string | null;
  customerEmail: string | null;
  currency: CURRENCY;
  paidAt: Date | null;
};
export const RenderFeePaymentDetails = () => {
  const { dialogs, id, onClose } = useGenericDialog();

  const [paymentDetails, setPaymentDetails] = useState<
    TRenderPayments["payments"][number] | undefined
  >();

  useEffect(() => {
    if (!id || !dialogs["open-service-detail"]) return;

    startTransition(async () => {
      const { error, transaction } = await getServicePaymentByTransactionId(
        id as string,
      );

      if (error) {
        toast.error(error);
        return;
      }

      setPaymentDetails(transaction);
    });
  }, [id, dialogs]);

  return (
    <Dialog
      open={!!dialogs["open-service-detail"]}
      onOpenChange={() => onClose("open-service-detail")}>
      {!!dialogs["open-service-detail"] && !!id && !!paymentDetails ? (
        <DialogContent className="w-full md:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Service Payment Details</DialogTitle>
            <DialogDescription>
              This shows a detail breakdown of the selected service payment
              details including the client who made the payment.
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
