import { CardLikeErrorComponent } from "@/components/customComponents/card-like-error-component";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
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
      <PageHeader
        pageTitle="Manage Services"
        showAddButton
        buttonText="Add Service"
        modalKey="create-service"
        permission="create:services"
      />

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
