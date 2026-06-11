import { CardLikeErrorComponent } from "@/components/customComponents/card-like-error-component";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, CheckCircle2, Clock, Handshake } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { verifyPaymentWithRefAction } from "./verify-payment-with-ref-action";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default function VerifyPaymentPage({ searchParams }: SearchParams) {
  return (
    <div className="w-full md:max-w-lg">
      <Suspense fallback={<ShowLoadingState />}>
        <RenderVerifyPayment searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const RenderVerifyPayment = async ({ searchParams }: SearchParams) => {
  await connection();

  const query = await searchParams;
  const reference = query.reference ?? "";

  if (!reference) {
    redirect("/");
  }

  const { error, result } = await verifyPaymentWithRefAction(reference);

  if (error) {
    return <CardLikeErrorComponent error={error} />;
  }

  if (result) {
    const parsed =
      result.metadata === null
        ? null
        : typeof result.metadata === "string"
          ? JSON.parse(result.metadata)
          : result.metadata;

    const serviceName = parsed?.serviceName;

    return (
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="border-b pb-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600 ring-1 ring-inset ring-green-500/25">
              <CheckCircle2 className="size-3" />
              Step 3 of 5 &mdash; Payment Confirmed
            </span>
          </div>
          <CardTitle className="flex items-center gap-3 mb-2">
            <span className="size-11 flex justify-center items-center rounded-full bg-green-500/15 shrink-0">
              <Handshake className="size-6 text-green-600" />
            </span>
            <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-muted-foreground text-transparent bg-clip-text">
              Payment Successful
            </h1>
          </CardTitle>
          <CardDescription className="bg-primary/5 rounded-lg border p-3 font-mono text-xs text-justify leading-relaxed">
            Your payment was verified successfully. Please keep your Transaction
            ID and Reference Code safely — they will be required for any support
            requests.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-5">
          <div className="space-y-4">
            <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Payment Summary
            </h4>
            <div className="rounded-lg border overflow-hidden divide-y">
              <div className="flex justify-between items-center px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium">Amount Paid</span>
                <span className="font-mono font-semibold text-sm">
                  {result.currency} {Number(result.amount)}.00
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3">
                <span className="text-sm font-medium">Transaction ID</span>
                <span className="font-mono text-sm text-muted-foreground">
                  {String(result.transactionId)}
                </span>
              </div>
              <div className="flex justify-between items-center px-4 py-3 bg-muted/30">
                <span className="text-sm font-medium">Reference</span>
                <span className="font-mono text-sm text-muted-foreground">
                  {result.reference}
                </span>
              </div>
            </div>
            <Link
              href={
                serviceName.toLowerCase().includes("admission")
                  ? `/online-admissions/enrollment/${result.admissionId}`
                  : `/online-payments/payment-summary?studentId=${result.studentId}&reference=${result.reference}`
              }
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full h-11",
              })}>
              {serviceName.toLowerCase().includes("admission")
                ? "Access Admission Form"
                : "Access Payment Receipt"}
              <ArrowRight className="size-4 ml-2" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:max-w-lg shadow-lg border-t-4 border-t-amber-500">
      <CardHeader className="border-b pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 ring-1 ring-inset ring-amber-500/25">
            <Clock className="size-3" />
            Processing Payment
          </span>
        </div>
        <CardTitle className="flex items-center gap-3 mb-2">
          <span className="size-11 flex justify-center items-center rounded-full bg-amber-500/15 shrink-0">
            <Handshake className="size-6 text-amber-600" />
          </span>
          <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
            Transaction In Progress
          </h1>
        </CardTitle>
        <CardDescription className="bg-amber-500/5 rounded-lg border border-amber-500/20 p-3 font-mono text-xs text-justify leading-relaxed">
          Your transaction is still in progress. Kindly wait patiently. You can
          refresh the page in about 5 seconds to check the completion status.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <ShowLoadingState />
      </CardContent>
    </Card>
  );
};
