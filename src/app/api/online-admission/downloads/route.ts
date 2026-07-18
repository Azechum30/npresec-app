import { EnrollmentTemplate } from "@/app/(online-admission)/online-admissions/admission-documents/[admissionId]/_components/enrollment-form-template";
import { pubArcjectRateLimit, pubBotProtection } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import { connection, NextRequest, NextResponse } from "next/server";
import React from "react";

export const GET = async (req: NextRequest) => {
  await connection();
  try {
    const { searchParams } = new URL(req.url);

    const admissionId = searchParams.get("admissionId");

    if (!admissionId) {
      return NextResponse.json(
        { error: "Missing a valid admission ID" },
        { status: 400 },
      );
    }

    const [ratelimit, bot] = await Promise.all([
      pubArcjectRateLimit(),
      pubBotProtection(),
    ]);

    if (ratelimit.error) {
      return NextResponse.json({ error: ratelimit.error }, { status: 429 });
    }

    if (bot.error) {
      return NextResponse.json({ error: bot.error }, { status: 403 });
    }

    const verifyPaymentStatus = await prisma.payment.findFirst({
      where: { admissionId: admissionId },
      select: { admissionId: true, admission: true, paymentStatus: true },
    });

    if (
      !verifyPaymentStatus ||
      verifyPaymentStatus.paymentStatus === "PENDING"
    ) {
      return NextResponse.json(
        { error: "You did not pay for the enrollment fee!" },
        { status: 400 },
      );
    }

    const studentDetails = verifyPaymentStatus.admission;

    if (!studentDetails?.isFormSubmitted) {
      return NextResponse.json(
        { error: "You did not complete the enrollment form. Kindly so now" },
        { status: 400 },
      );
    }

    const formatData = {
      ...studentDetails,
      residentialStatus: studentDetails.residentialStatus as string,
      admissionStatus: studentDetails.admissionStatus as string,
    };
    const pdf = await renderToBuffer(
      React.createElement(EnrollmentTemplate, { data: formatData }) as any,
    );

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${studentDetails.jhsIndexNumber}-Enrollement-Form.pdf"`,
      },
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
