"use server";
import { pubArcjectRateLimit, pubBotProtection } from "@/lib/arcjet";
import { ActionError } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const verifyPaymentWithReference = async (reference: string) => {
  try {
    const [rateLimit, botDetection] = await Promise.all([
      pubArcjectRateLimit(),
      pubBotProtection(),
    ]);

    if (rateLimit.error) {
      throw new ActionError(rateLimit.error, 429, "RATE_LIMIT_ERROR");
    }

    if (botDetection.error) {
      throw new ActionError(botDetection.error, 403, "BOT_DETECTION_ERROR");
    }

    const payment = await prisma.payment.findUnique({
      where: { reference },
      select: {
        paidAt: true,
        currency: true,
        transactionId: true,
        amount: true,
        metadata: true,
      },
    });

    if (!payment)
      throw new ActionError(
        "No payment record found with the given reference.",
      );

    const formatted = {
      ...payment,
      amount: Number(payment.amount),
      metadata: payment.metadata as {
        studentId: string;
        name: string;
        serviceName: string;
      },
    };

    return { payment: formatted };
  } catch (e) {
    console.log(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
