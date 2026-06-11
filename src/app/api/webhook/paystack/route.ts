import { prisma } from "@/lib/prisma";
import { env } from "@/lib/server-only-actions/validate-env";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-paystack-signature");
    const secret = env.PAYSTACK_SECRET_KEY;

    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
      const { id, reference, paid_at, metadata } = event.data;
      const Index = metadata?.studentId;
      const serviceTypeId = metadata?.serviceTypeId;
      const serviceName = (metadata?.serviceName as string) ?? "";

      const student = serviceName.toLowerCase().includes("admission")
        ? await prisma.admission.findUnique({
            where: { jhsIndexNumber: Index },
          })
        : await prisma.student.findUnique({
            where: { studentNumber: Index },
          });

      if (!student)
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 },
        );

      if (
        ("isAcceptancePaid" in student && student.isAcceptancePaid) ||
        ("isPaymentAccepted" in student && student.isPaymentAccepted)
      ) {
        return NextResponse.json(
          { success: true, message: "Already processed" },
          { status: 200 },
        );
      }

      await prisma.$transaction(async (tsx) => {
        const existingRef = await tsx.payment.findUnique({
          where: { reference: reference },
        });

        if (existingRef) return;
        const fee = await tsx.fee.findUnique({
          where: { id: serviceTypeId },
        });

        if (!fee) return;

        const studentStatus =
          "isAcceptancePaid" in student
            ? await tsx.admission.findUnique({
                where: { id: student.id },
                select: { isAcceptancePaid: true },
              })
            : await prisma.student.findUnique({
                where: { studentNumber: student.id },
              });

        if (
          ("isAcceptancePaid" in studentStatus! &&
            studentStatus.isAcceptancePaid) ||
          ("isPaymentAccepted" in studentStatus! &&
            studentStatus.isPaymentAccepted)
        )
          return;

        await tsx.payment.create({
          data: {
            paymentStatus: "SUCCESS",
            reference: reference,
            transactionId: id,
            paidAt: paid_at,
            metadata: metadata,
            amount: event.data.amount / 100,
            transactionFee: event.data.fees / 100,
            accountName: event.data.authorization.account_name,
            ReceiverAccountNumber:
              event.data.authorization.receiver_account_number,
            ReceiverBank: event.data.authorization.receiver_bank,
            channel: event.data.channel,
            bank: event.data.authorization.bank,
            brand: event.data.authorization.brand,
            cardType: event.data.authorization.card_type,
            currency: event.data.currency,
            countryCode: event.data.authorization.country_code,
            customerCode: event.data.customer.customer_code,
            customerName:
              event.data.customer.first_name +
              " " +
              event.data.customer.last_name,
            customerEmail: event.data.customer.email,
            customerPhoneNumber: event.data.customer.phone,
            customerInternationalPhoneFormat:
              event.data.customer.international_format_phone,
            orderId: event.data.order_Id,
            ipAddress: event.data.ip_address,
            RequestedAmount: event.data.requested_amount / 100,
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
            where: { jhsIndexNumber: Index },
            data: { isAcceptancePaid: true },
          });
        } else {
          await prisma.student.update({
            where: { studentNumber: Index },
            data: { isPaymentAccepted: true },
          });
        }

        await tsx.fee.update({
          where: { id: fee.id },
          data: {
            count: { increment: 1 },
          },
        });
      });

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ message: "Event ignored" }, { status: 200 });
  } catch (e: any) {
    console.error("Webhook Error:", e.message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
