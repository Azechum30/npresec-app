"use server";
import "server-only";

import { ActionError } from "@/lib/constants";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import * as Sentry from "@sentry/nextjs";

export const verifyPaymentWithRefAction = async (ref: string) => {
  try {
    const existingPayment = await prisma.payment.findUnique({
      where: { reference: ref },
    });

    if (existingPayment && existingPayment.paymentStatus === "SUCCESS") {
      return { result: existingPayment };
    }

    const res = await fetch(`${env.PAYSTACK_VERIFY_TRANSACTION_URL}/${ref}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}` },
    });

    const body = await res.json();

    if (!res.ok || body.data.status !== "success") {
      throw new ActionError("Payment verification failed or incomplete.");
    }

    const { id, metadata, paid_at } = body.data;
    const studentId = metadata?.studentId;
    const serviceTypeId = metadata?.serviceTypeId;

    const result = await prisma.$transaction(async (tsx) => {
      const alreadyPaid = await tsx.payment.findUnique({
        where: { reference: ref },
      });

      if (alreadyPaid) return alreadyPaid;

      const fee = await tsx.fee.findFirst({
        where: { id: serviceTypeId },
      });

      if (!fee) throw new ActionError("Service config is missing");

      const student = fee.name.toLowerCase().includes("admission")
        ? await tsx.admission.findUnique({
            where: { jhsIndexNumber: studentId },
          })
        : await prisma.student.findUnique({
            where: { studentNumber: studentId },
          });

      if (!student) throw new ActionError("Student not found");

      if (
        ("isAcceptancePaid" in student && student.isAcceptancePaid) ||
        ("isPaymentAccepted" in student && student.isPaymentAccepted)
      ) {
        return await tsx.payment.findFirst({
          where: { reference: ref },
        });
      }

      const createPayment = await tsx.payment.create({
        data: {
          paymentStatus: "SUCCESS",
          reference: ref,
          transactionId: id,
          paidAt: paid_at,
          metadata: metadata,
          amount: body.data.amount / 100,
          transactionFee: body.data.fees / 100,
          accountName: body.data.authorization.account_name,
          ReceiverAccountNumber:
            body.data.authorization.receiver_account_number,
          ReceiverBank: body.data.authorization.receiver_bank,
          channel: body.data.channel,
          bank: body.data.authorization.bank,
          brand: body.data.authorization.brand,
          cardType: body.data.authorization.card_type,
          currency: body.data.currency,
          countryCode: body.data.authorization.country_code,
          customerCode: body.data.customer.customer_code,
          customerName:
            body.data.customer.first_name + " " + body.data.customer.last_name,
          customerEmail: body.data.customer.email,
          customerPhoneNumber: body.data.customer.phone,
          customerInternationalPhoneFormat:
            body.data.customer.international_format_phone,
          orderId: body.data.order_Id,
          ipAddress: body.data.ip_address,
          RequestedAmount: body.data.requested_amount / 100,
          admission: fee.name.toLowerCase().includes("admission")
            ? { connect: { id: student.id } }
            : undefined,
          student: !fee.name.toLowerCase().includes("admission")
            ? { connect: { id: student.id } }
            : undefined,
          fee: { connect: { id: fee.id } },
        },
      });

      if (fee.name.toLowerCase().includes("admission")) {
        await tsx.admission.update({
          where: { jhsIndexNumber: studentId },
          data: { isAcceptancePaid: true },
        });
      } else {
        await tsx.student.update({
          where: { studentNumber: studentId },
          data: { isPaymentAccepted: true },
        });
      }

      await tsx.fee.update({
        where: { id: fee.id },
        data: {
          count: { increment: 1 },
        },
      });

      return createPayment;
    });

    return { result };
  } catch (e) {
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
