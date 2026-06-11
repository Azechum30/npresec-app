import { prisma } from "@/lib/prisma";
import { ServicesSelect } from "@/lib/types";
import { FEE_PAYMENT_STATUS } from "@/lib/validation";
import { cacheLife, cacheTag } from "next/cache";
import "server-only";

export const getCachedServices = async () => {
  "use cache";
  cacheTag("services");
  cacheLife("max");

  const data = await prisma.fee.findMany({
    select: ServicesSelect,
  });

  const transformedData = data.map((s) => ({
    ...s,
    price: String(s.price) + ".00",
    status: s.status as FEE_PAYMENT_STATUS,
    payments: s.payments.map((p) => ({
      ...p,
      amount: String(p.amount) + ".00",
      RequestedAmount: String(p.RequestedAmount) + ".00",
      transactionFee: String(p.transactionFee).includes(".")
        ? String(p.transactionFee)
        : String(p.transactionFee) + ".00",
      transactionId: String(p.transactionId),
    })),
  }));

  return transformedData;
};
