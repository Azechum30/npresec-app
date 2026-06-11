import { Notification } from "@/components/customComponents/notification";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { Row } from "@tanstack/react-table";
import { ViewIcon } from "lucide-react";
import { TServiceOutput } from "./render-services-tb";

type TServiceSummary = {
  row: Row<TServiceOutput>;
};

export const ServiceSummary = ({ row }: TServiceSummary) => {
  const data = row.original;

  const { onOpen } = useGenericDialog();

  const handleServiceDetailDisplay = (transactionId: string) => {
    onOpen("open-service-detail", transactionId);
  };

  return (
    <Card className="shadow-lg relative">
      <CardHeader className="border-b ">
        <CardTitle className="text-lg bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-bold">
          Service Summary
        </CardTitle>
        <CardDescription>
          A detailed summary of all payments received for the above service.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {data.payments && data.payments.length > 0 ? (
          <>
            <div className="grid grid-cols-6 space-x-3 place-items-center border-b mb-2 pb-2">
              <div className="text-sm font-bold">SN</div>
              <div className="text-sm font-bold">Bank</div>
              <div className="text-sm font-bold">Paid</div>
              <div className="text-sm font-bold">T'Fee</div>
              <div className="text-sm font-bold">T'ID</div>
              <div className="text-sm font-bold">PaidAt</div>
            </div>

            {data.payments.map((payment, index) => (
              <div
                className="grid grid-cols-6 space-x-3 mb-2 pb-2 place-items-center border-b"
                key={payment.id}>
                <div className="size-8 border border-primary flex justify-center items-center p-1.5 font-bold rounded-full bg-linear-60 from-primary/20 text-muted-foreground/">
                  {index + 1}
                </div>
                <div>{payment.bank}</div>
                <div>{payment.amount}</div>
                <div>{payment.transactionFee}</div>
                <div>
                  <Button
                    onClick={() =>
                      handleServiceDetailDisplay(payment.transactionId)
                    }
                    variant="link">
                    <ViewIcon className="size-4 text-primary" />
                    <span>{payment.transactionId}</span>
                  </Button>
                </div>
                <div>
                  {new Intl.DateTimeFormat("en-GH", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(payment.paidAt as Date)}
                </div>
              </div>
            ))}
            <div className="absolute border rounded-md p-2  text-right top-4 right-4 flex space-x-2 justify-end items-center">
              <div className="font-bold">Total Earnings</div>
              <div className="w-16 h-6 font-bold flex justify-center rounded-md items-center bg-linear-90 from-primary/20 to-muted-foreground/30 p-4 border border-primary">
                {String(
                  data.payments.reduce(
                    (acc, curr) => acc + Number(curr.amount),
                    0.0,
                  ) + ".00",
                )}
              </div>
            </div>
          </>
        ) : (
          <Notification description="This service has no summary" />
        )}
      </CardContent>
    </Card>
  );
};
