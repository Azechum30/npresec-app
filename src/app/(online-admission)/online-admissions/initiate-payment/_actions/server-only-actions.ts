"use server";

import { ActionError } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { InitiatePaymentSchema, InitiatePaymentType } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getAdmissionAmount = async (id: string) => {
  try {
    const amount = await prisma.payment.findFirst({
      where: { admission: { jhsIndexNumber: id } },
      select: { amount: true, currency: true },
    });

    if (!amount)
      throw new ActionError("No payment amount has been set for this student");

    return { amount };
  } catch (e) {
    console.log(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};

export async function initializePayment(values: InitiatePaymentType) {
  try {
    const {
      error,
      success,
      data: RequestData,
    } = InitiatePaymentSchema.safeParse(values);

    if (!success) throw error;

    const { email, amount, studentId, name } = RequestData;

    const res = await fetch(`${env.PAYSTACK_INITIATE_TRANSACTION_URL.trim()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100),
        callback_url: `${env.NEXT_PUBLIC_URL}/online-admissions/verify-payment`,
        metadata: {
          custom_fields: { studentId, name },
        },
      }),
    });

    const data = await res.json();
    if (!data.status) throw new ActionError(data.message);

    return { url: data.data.authorization_url as string };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
}
