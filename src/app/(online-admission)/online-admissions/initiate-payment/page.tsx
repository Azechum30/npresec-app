import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { CURRENCY } from "@/lib/validation";
import { connection } from "next/server";
import { Suspense } from "react";
import { getAdmissionAmount } from "./_actions/server-only-actions";
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

  const { error, amount } = await getAdmissionAmount(studentId);

  if (error) {
    return <ErrorComponent error={error} />;
  }

  if (amount) {
    return (
      <InitiatePaymentForm
        studentId={studentId}
        amount={Number(amount.amount)}
        currency={amount.currency as CURRENCY}
      />
    );
  }

  return null;
};
