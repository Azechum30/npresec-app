import { Button } from "@/components/ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { TRenderPayments } from "../../payments/_components/render-payments";

export const PaymentDetails = ({
  transaction,
}: {
  transaction: TRenderPayments["payments"][number];
}) => {
  const { dialogs, onClose } = useGenericDialog();
  return (
    <div className="border rounded-md p-4 flex flex-col space-y-4 max-h-[75vh] overflow-y-auto scrollbar-thin">
      <fieldset className="border rounded-md p-4">
        <legend className="bg-clip-text text-transparent bg-linear-60 from-primary to-muted-foreground text-base font-bold">
          Payee&apos;s Personal Details
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Full Name</div>
            <div className="text-sm">{transaction.metadata.name}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">ID</div>
            <div className="text-sm">{transaction.metadata.studentId}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Code</div>
            <div className="text-sm">{transaction.customerCode}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Email</div>
            <div className="text-sm">{transaction.customerEmail}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Contact</div>
            <div className="text-sm">
              {transaction.customerPhoneNumber ?? "N/A"}
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="border rounded-md p-4">
        <legend className="bg-clip-text text-transparent bg-linear-60 from-primary to-muted-foreground text-base font-bold">
          Transaction Details
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Payment Channel</div>
            <div className="text-sm">
              {transaction.channel?.split("_").join(" ")}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Bank</div>
            <div className="text-sm">{transaction.bank}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Card Type</div>
            <div className="text-sm">
              {transaction.cardType ? transaction.cardType : "N/A"}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Amount Paid</div>
            <div className="text-sm">{transaction.amount}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Transaction Fee</div>
            <div className="text-sm">{transaction.transactionFee ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Transaction ID</div>
            <div className="text-sm">{transaction.transactionId ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Currency</div>
            <div className="text-sm">{transaction.currency ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Payment Reference</div>
            <div className="text-sm">{transaction.reference ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Order ID</div>
            <div className="text-sm">{transaction.orderId ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Device IP</div>
            <div className="text-sm">{transaction.ipAddress ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Service Name</div>
            <div className="text-sm">
              {transaction.metadata.serviceName ?? "N/A"}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Payment Date</div>
            <div className="text-sm">
              {new Intl.DateTimeFormat("en-GH", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              }).format(transaction.paidAt as Date)}
            </div>
          </div>
        </div>
      </fieldset>
      <fieldset className="border rounded-md p-4">
        <legend className="bg-clip-text text-transparent bg-linear-60 from-primary to-muted-foreground text-base font-bold">
          Receiver&apos;s Account Details
        </legend>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Account Name</div>
            <div className="text-sm">{transaction.accountName ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Bank</div>
            <div className="text-sm">{transaction.ReceiverBank ?? "N/A"}</div>
          </div>
          <div className="flex flex-col space-y-1">
            <div className="text-sm font-bold">Account Number</div>
            <div className="text-sm">
              {transaction.ReceiverAccountNumber ?? "N/A"}
            </div>
          </div>
        </div>
      </fieldset>
      <div className="w-full text-center">
        <Button
          onClick={() =>
            onClose(
              !!dialogs["open-service-detail"]
                ? "open-service-detail"
                : "view-payment-details",
            )
          }
          variant="default"
          className="w-full"
          size="lg">
          Cancel
        </Button>
      </div>
    </div>
  );
};
