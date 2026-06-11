"use server";

import { ActionError } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import { InitiatePaymentSchema, InitiatePaymentType } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import "server-only";

export const getFeeTypeAmount = async (serviceTypeId: string) => {
  try {
    const amount = await prisma.fee.findFirst({
      where: { id: serviceTypeId },
      select: { price: true, currency: true },
    });

    if (!amount)
      throw new ActionError("No price has been set in the service config");

    return { amount };
  } catch (e) {
    console.error(e);
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

    const {
      email,
      amount,
      studentId,
      name,
      phone,
      serviceTypeId,
      serviceName,
    } = RequestData;

    const checkExistingPayment = await prisma.payment.findFirst({
      where: {
        OR: [
          {
            admission: { jhsIndexNumber: studentId },
          },
          {
            student: { studentNumber: studentId },
          },
        ],
      },
    });

    if (checkExistingPayment) {
      return { message: "The selected student has already made payment" };
    }

    const res = await fetch(`${env.PAYSTACK_INITIATE_TRANSACTION_URL.trim()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY.trim()}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        last_name: name.split(" ")[0],
        first_name: name.split(" ")[1],
        phone,
        amount: Math.round(Number(amount) * 100),
        callback_url: `${env.NEXT_PUBLIC_URL}/online-admissions/verify-payment`,
        metadata: {
          custom_fields: [
            {
              display_name: "Student ID",
              variable_name: "student_id",
              value: studentId,
            },
            {
              display_name: "Full Name",
              variable_name: "full_name",
              value: name,
            },
            {
              display_name: "Phone Number",
              variable_name: "phone_number",
              value: phone,
            },
          ],
          studentId,
          name,
          phone,
          serviceTypeId,
          serviceName,
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
