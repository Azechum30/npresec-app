import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { connection } from "next/server";
import { Suspense } from "react";
import { getPayments } from "./_actions/get-payments";
import { RenderPaymentsTB } from "./_components/render-payments";
import { ViewPaymentDetailsModal } from "./_components/view-payment-detail-modal";

export default function PaymentsPage() {
  return (
    <>
      <Suspense fallback={<FallbackComponent />}>
        <RenderPayments />
      </Suspense>

      <ViewPaymentDetailsModal />
    </>
  );
}

const RenderPayments = async () => {
  await connection();

  const { error, payments } = await getPayments();

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (!payments) return <ShowLoadingState />;

  return <RenderPaymentsTB payments={payments} />;
};
