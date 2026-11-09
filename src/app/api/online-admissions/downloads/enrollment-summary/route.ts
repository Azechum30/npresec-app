/**biome-ignore-all assist/source/organizeImports:reason */
import { EnrollmentTemplate } from "@/app/(online-admission)/online-admissions/admission-documents/[admissionId]/_components/enrollment-form-template";
import { pubArcjectRateLimit, pubBotProtection } from "@/lib/arcjet";
import { prisma } from "@/lib/prisma";
import { r2Client } from "@/lib/r2";
import { env } from "@/lib/server-only-actions/validate-env";
import { verifyPaymentStatus } from "@/utils/verify-payment-status";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Document, renderToBuffer } from "@react-pdf/renderer";
import { type NextRequest, NextResponse } from "next/server";
import React from "react";

export const GET = async (req: NextRequest) => {
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

    const data = await verifyPaymentStatus(admissionId);

    const fileKey = `admission/enrollment-summary/${data.jhsIndexNumber}`;
    const downloadHeaders = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment;filename="${fileKey}.pdf"`,
    });

    const existingEnrollmentSummary = await prisma.document.findFirst({
      where: { name: fileKey },
      select: { name: true },
    });

    if (existingEnrollmentSummary) {
      const r2Response = await r2Client.send(
        new GetObjectCommand({
          Bucket: env.R2_BUCKET_NAME,
          Key: existingEnrollmentSummary.name,
        }),
      );

      const fileByteArray = await r2Response.Body?.transformToByteArray();

      if (!fileByteArray) {
        return new NextResponse("No file found in the storage", {
          status: 404,
        });
      }

      return new NextResponse(new Uint8Array(fileByteArray), {
        status: 200,
        headers: downloadHeaders,
      });
    }

    const template = React.createElement(
      Document,
      { title: "Enrollment Form" },
      React.createElement(EnrollmentTemplate, data),
    );
    const pdf = await renderToBuffer(template);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: fileKey,
        Body: pdf,
        ContentType: "application/pdf",
      }),
    );

    await prisma.document.create({
      data: {
        admissionId,
        name: fileKey,
        type: "Enrollment Summary",
      },
    });

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: downloadHeaders,
    });
  } catch (e) {
    console.error("An error has occurred", e);
    return NextResponse.json(
      { error: "Failed to generated enrollment summary pdf" },
      { status: 500 },
    );
  }
};
