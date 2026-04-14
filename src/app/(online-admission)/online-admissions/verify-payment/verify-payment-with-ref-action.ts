"use server";
import "server-only";

import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";

export const verifyPaymentWithRefAction = async (ref: string) => {
  try {
    const verifiedData = await prisma.payment.findFirst({
      where: { reference: ref },
      select: {
        admissionId: true,
        amount: true,
        metadata: true,
        transactionId: true,
        currency: true,
        reference: true,
      },
    });

    if (!verifiedData) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    return {
      transactionId: verifiedData.transactionId,
      amount: verifiedData.amount,
      reference: verifiedData.reference,
      metadata: verifiedData.metadata as {
        custom_fields: { studentId: string; name: string };
      },
      currency: verifiedData.currency,
      admissionId: verifiedData.admissionId,
    };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
