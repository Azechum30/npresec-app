"use server";
import { ActionError } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getStudentPaymentDetails = async (reference: string) => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { reference: reference },
      select: {
        metadata: true,
        amount: true,
        paidAt: true,
        transactionId: true,
        channel: true,
        currency: true,
        bank: true,
      },
    });

    if (!payment)
      throw new ActionError(
        "No payment records found with the selected studentId and payment reference",
      );

    const formatted = {
      ...payment,
      amount: Number(payment.amount),
    };
    return { payment: formatted };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
