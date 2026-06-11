import { toProperCase } from "@/utils/string-transformer";
import { TRenderPayments } from "../_components/render-payments";

export const paymentDataTransformer = (
  payment: TRenderPayments["payments"][number],
) => ({
  "Student Name": payment.metadata.name,
  "Student ID": payment.metadata.studentId,
  "Service Type": payment.metadata.serviceName,
  "Amount Paid": payment.amount,
  "Payment Channel": toProperCase(
    payment.channel?.split("_").join(" ") as string,
  ),
  Currency: payment.currency,
  Bank: payment.bank,
  Brand: payment.brand,
  "Transaction ID": String(payment.transactionId),
  "Transaction Fee": payment.transactionFee,
  "Transaction Reference": payment.reference,
  "Payment Date": new Intl.DateTimeFormat("en-GH", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(payment?.paidAt as Date),
  "Country Code": payment.countryCode,
  "Student Email": payment.customerEmail,
});
