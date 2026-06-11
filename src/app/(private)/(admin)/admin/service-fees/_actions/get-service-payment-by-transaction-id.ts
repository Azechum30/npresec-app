"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { PaymentSelect } from "@/lib/types";
import { CURRENCY } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import z from "zod";

export const getServicePaymentByTransactionId = async (
  transactionId: string,
) => {
  try {
    const { hasPermission } = await getUserPermissions("view:payments");

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const { error, success, data } = z.string().safeParse(transactionId);
    if (!success) throw error;

    const transaction = await prisma.payment.findUnique({
      where: { transactionId: Number(data) },
      select: PaymentSelect,
    });

    if (!transaction)
      throw new ActionError("No transaction found with the given Id");

    const formatted = {
      ...transaction,
      amount: String(transaction.amount) + ".00",
      transactionFee: String(transaction.transactionFee).includes(".")
        ? String(transaction.transactionFee)
        : String(transaction.transactionFee) + ".00",
      metadata: transaction.metadata as {
        studentId: string;
        name: string;
        serviceName: string;
      },
      currency: transaction.currency as CURRENCY,
    };

    return { transaction: formatted };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
