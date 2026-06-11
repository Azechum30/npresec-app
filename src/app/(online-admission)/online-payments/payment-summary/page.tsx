import { CardLikeErrorComponent } from "@/components/customComponents/card-like-error-component";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { env } from "@/lib/server-only-actions/validate-env";
import { connection } from "next/server";
import QRCode from "qrcode";
import { Suspense } from "react";
import { getStudentPaymentDetails } from "./_actions/get-student-payment-details";
import { PrintComponent } from "./_components/print-component";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default function PaymentSummary({ searchParams }: SearchParams) {
  return (
    <>
      <Suspense fallback={<ShowLoadingState />}>
        <RenderOnlinePaymentSummaryComponent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const RenderOnlinePaymentSummaryComponent = async ({
  searchParams,
}: SearchParams) => {
  await connection();

  const query = await searchParams;
  const reference = query.reference ?? "";

  const { error, payment } = await getStudentPaymentDetails(reference);

  if (error) {
    return <CardLikeErrorComponent error={error} />;
  }

  if (!payment) return null;

  const url = `${env.NEXT_PUBLIC_URL}/online-payments/verify/${reference}`;

  const qrCodeUrl = await generatePaymentQRcode(url);

  return <PrintComponent url={url} qrCodeUrl={qrCodeUrl} payment={payment} />;
};

const generatePaymentQRcode = async (url: string) => {
  try {
    const dataUrl = await QRCode.toDataURL(url, {
      width: 220,
      margin: 2,
      color: { dark: "#0d0000", light: "#ffffff" },
    });

    return dataUrl;
  } catch (e) {
    console.error("Could not verify student results: ", e);
    return "";
  }
};
