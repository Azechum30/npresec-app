import { CardLikeErrorComponent } from "@/components/customComponents/card-like-error-component";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";
import { connection } from "next/server";
import { Suspense } from "react";
import { verifyPaymentWithReference } from "./_actions/verify-payment-with-reference";

type Params = {
  params: Promise<{ reference: string }>;
};

export default function VerifyPaymentPage({ params }: Params) {
  return (
    <Suspense fallback={<ShowLoadingState />}>
      <RenderVerifyPaymentComponent params={params} />
    </Suspense>
  );
}

const RenderVerifyPaymentComponent = async ({ params }: Params) => {
  await connection();

  const { reference } = await params;
  if (!reference) return null;
  const { error, payment } = await verifyPaymentWithReference(reference);

  if (error) {
    return <CardLikeErrorComponent error={error} />;
  }

  if (payment) {
    return (
      <Card className="shadow-xl w-full md:max-w-lg">
        <CardHeader>
          <CardTitle className="flex justify-center items-center space-x-2">
            <ShieldCheckIcon className="text-green-400 size-8" />
            <h1 className="text-xl font-bold bg-linear-120 from-green-500 to-muted-foreground bg-clip-text text-transparent">
              Payment Verified
            </h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="">
          <div className="border rounded-lg p-4 space-y-3">
            <div className="text-base font-bold bg-primary/5 p-3 border border-primary text-center rounded-md ">
              Payment Summary
            </div>
            <div className="grid grid-cols-2 items-center justify-between gap-4">
              <div className="text-sm border-b pb-2 font-bold">Description</div>
              <div className="text-sm text-right font-bold border-b pb-2">
                Amount
              </div>
              <div className="text-sm">Student Name</div>
              <div className="text-sm text-right font-bold">
                {payment.metadata.name}
              </div>
              <div className="text-sm">Student ID</div>
              <div className="text-sm text-right font-bold">
                {payment.metadata.studentId}
              </div>
              <div className="text-sm">{payment.metadata?.serviceName}</div>
              <div className="text-sm text-right font-bold">{`${payment.amount}.00`}</div>
              <div className="text-sm">Receipt Number</div>
              <div className="text-sm text-right font-bold">
                {payment.transactionId}
              </div>
              <div className="text-sm">Currency</div>
              <div className="text-sm text-right font-bold">
                {payment.currency}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};
