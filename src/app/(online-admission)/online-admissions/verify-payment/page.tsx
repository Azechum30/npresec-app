import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Handshake } from "lucide-react";
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

  const result = await verifyPaymentWithRefAction(reference);

  if (result.error) {
    return <ErrorComponent error={result.error} />;
  }

  if (result.amount) {
    return (
      <Card className="shadow-lg hover:shadow-2xl">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center space-x-2 mb-3">
            <span className="size-12 flex justify-center items-center p-1.5 rounded-full border-primary/20 bg-primary/20">
              <Handshake className="size-8" />
            </span>
            <h1 className="text-lg font-semibold tracking-tight bg-linear-to-r from-primary to-muted-foreground text-transparent bg-clip-text">
              Payment Successful
            </h1>
          </CardTitle>
          <CardDescription className="bg-primary/5 rounded-md border p-2 text-justify font-mono">
            Your payment was verified and successful. Thank you for using our
            services. Below is a summary of the transaction. Kindly keep your
            Transaction ID and and Reference Code safely. It would be required
            in case of any support you require in verifying your payment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h4 className="font-bold text-sm">Payment Summary</h4>
            <div className="w-full rounded-md border p-3 flex flex-col gap-3">
              <div className="flex justify-between">
                <span className="font-semibold">Amount Paid:</span>
                <span className="font-mono ">
                  {result.currency} {result.amount + ".00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Transaction ID:</span>
                <span className="font-mono">
                  {String(result.transactionId)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Reference:</span>
                <span className="font-mono">{result.reference}</span>
              </div>
            </div>
            <div>
              <Link
                href={`/online-admissions/enrollment/${result.admissionId}`}
                className={buttonVariants({
                  variant: "default",
                  size: "lg",
                  className: "w-full ",
                })}>
                <ArrowRight className="size-5 mr-1" />
                Access Admission Form
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full md:max-w-lg shadow-xs hover:shadow-2xl transition-shadow">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center space-x-2 mb-3">
          <span className="size-12 flex justify-center items-center rounded-full bg-primary/10">
            <Handshake className="size-8" />
          </span>
          <h1 className="text-lg font-bold tracking-tight bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
            Transaction In Progress
          </h1>
        </CardTitle>
        <CardDescription className="bg-primary/5 rounded-md border p-1.5 text-justify font-mono">
          Your transaction is still in progress. Kindly wait patiently for the
          process to finsh. You can refresh your page in about 5 seconds to
          ascertain the completion rate of the transaction.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShowLoadingState />
      </CardContent>
    </Card>
  );
};
