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
      const { id, reference, metadata } = event.data;
      const jhsIndex = metadata?.custom_fields.studentId;

      const student = await prisma.admission.findUnique({
        where: { jhsIndexNumber: jhsIndex },
        include: { payments: true },
      });

      if (!student)
        return NextResponse.json(
          { error: "Student not found" },
          { status: 404 },
        );

      if (student.isAcceptancePaid) {
        return NextResponse.json(
          { success: true, message: "Already processed" },
          { status: 200 },
        );
      }

      await prisma.$transaction(async (tsx) => {
        const paymentRecord = await tsx.payment.findFirst({
          where: { admissionId: student.id, paymentStatus: "PENDING" },
        });

        if (!paymentRecord) throw new Error("No pending payment record found");

        await tsx.payment.update({
          where: { id: paymentRecord.id },
          data: {
            paymentStatus: "SUCCESS",
            reference: reference,
            transactionId: id,
            paidAt: new Date(),
            metadata: metadata,
          },
        });

        await tsx.admission.update({
          where: { id: student.id },
          data: { isAcceptancePaid: true },
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
