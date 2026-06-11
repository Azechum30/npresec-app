import { CardLikeErrorComponent } from "@/components/customComponents/card-like-error-component";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { CURRENCY } from "@/lib/validation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getFeeTypeAmount } from "./_actions/server-only-actions";
import { InitiatePaymentForm } from "./_forms/placed-student-details-form";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default function InitiatePayment({ searchParams }: SearchParams) {
  return (
    <div className="w-full md:max-w-lg">
      <Suspense fallback={<ShowLoadingState />}>
        <RenderInitiatePayment searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const RenderInitiatePayment = async ({ searchParams }: SearchParams) => {
  await connection();
  const query = await searchParams;

  const studentId = query.studentId ?? "";
  const serviceTypeId = query.service_type_Id ?? "";
  const serviceName = query.service_name ?? "";

  const { error, amount } = await getFeeTypeAmount(serviceTypeId);

  if (error) {
    return <CardLikeErrorComponent error={error} />;
  }

  if (amount) {
    return (
      <InitiatePaymentForm
        studentId={studentId}
        amount={String(amount.price) + ".00"}
        currency={amount.currency as CURRENCY}
        serviceTypeId={serviceTypeId}
        serviceName={serviceName}
      />
    );
  }

  return null;
};
