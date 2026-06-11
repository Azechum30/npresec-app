import { CardLikeErrorComponent } from "@/components/customComponents/card-like-error-component";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getServicesAction } from "./_actions/get-services-action";
import { EditServiceModal } from "./_components/edit-service-modal";
import { RenderCreateServiceFormModal } from "./_components/render-create-service-form-modal";
import { RenderFeePaymentDetails } from "./_components/render-fee-payment-details";
import { RenderServicesTB } from "./_components/render-services-tb";

export const metadata: Metadata = {
  title: "Services",
  description: "This page shows all payment services in the school.",
};

export default function ServiceFees() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-base font-semibold tracing-tight line-clamp-1">
          Services
        </h1>
        <OpenDialogs dialogKey="create-service" title="Add Service" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderServicesDataTB />
      </Suspense>

      <RenderCreateServiceFormModal />
      <EditServiceModal />
      <RenderFeePaymentDetails />
    </>
  );
}

const RenderServicesDataTB = async () => {
  await connection();
  const { error, services } = await getServicesAction();

  if (error) {
    return <CardLikeErrorComponent error={error} />;
  }

  return <RenderServicesTB services={services} />;
};
