import { prisma } from "@/lib/prisma";
import { PaymentSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";

export const getCachedPayments = async () => {
  "use cache";
  cacheLife("max");
  cacheTag("payments");

  const payments = await prisma.payment.findMany({
    where: { deletedAt: null },
    select: PaymentSelect,
  });

  const formattedPayments = payments.map((pay) => ({
    ...pay,
    amount: String(pay.amount) + ".00",
    transactionFee: String(pay.transactionFee).includes(".")
      ? String(pay.transactionFee)
      : String(pay.transactionFee) + ".00",
    metadata: pay.metadata as {
      studentId: string;
      name: string;
      serviceName: string;
    },
  }));

  return formattedPayments;
};
