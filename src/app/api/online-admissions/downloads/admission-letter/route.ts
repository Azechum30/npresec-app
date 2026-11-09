/**biome-ignore-all assist/source/organizeImports:reason */

import { AdmissionLetterTemplate } from "@/app/(online-admission)/online-admissions/admission-documents/[admissionId]/_components/admission-letter-template";
import { pubArcjectRateLimit, pubBotProtection } from "@/lib/arcjet";
import { generateGenericQRCode } from "@/lib/generate-generic-qrcode";
import { generateAdmissionLetterHash } from "@/lib/hash-utils";
import { prisma } from "@/lib/prisma";
import { getStudentAdmissionData } from "@/utils/get-student-admission-data";
import { Document, renderToBuffer } from "@react-pdf/renderer";
import { type NextRequest, NextResponse } from "next/server";
import React from "react";

import { r2Client } from "@/lib/r2";
import { env } from "@/lib/server-only-actions/validate-env";
import { getTemplateData } from "@/shared/get-template-data";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const admissionId = searchParams.get("admissionId");

    if (!admissionId)
      return NextResponse.json(
        { error: "A valid admission Id is required!" },
        { status: 400 },
      );

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

    const [data, templateData] = await Promise.all([
      getStudentAdmissionData(admissionId),
      getTemplateData("Admission Letter"),
    ]);

    console.log("Template Data", templateData);

    const hashToken = generateAdmissionLetterHash(admissionId);
    const url = `${process.env.NEXT_PUBLIC_URL}/online-admissions/verify-admission-letter?admissionId=${admissionId}&token=${hashToken}`;
    const qrcodeUrl = await generateGenericQRCode(url);

    const formattedData = {
      studentName: `${data.lastName} ${data.firstName} ${data.middleName ?? ""}`,
      programme: data.programme,
      admissionReference: data.studentNumber,
      selectedClass: data.assignedClass,
      residentialStatus: data.residentialStatus,
      houseAllocated: data.assignedHouse,
      qrcodeUrl,
      verificationLink: url,
      templateData,
    };

    const fileKey = `admission/letters/${data.studentNumber}`;
    const existingLetter = await prisma.document.findFirst({
      where: { name: fileKey },
      select: { name: true },
    });

    const downloadHeaders = new Headers({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment;filename="${fileKey}.pdf"`,
    });

    if (existingLetter) {
      const command = new GetObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: existingLetter.name,
      });
      const r2Response = await r2Client.send(command);

      const fileByteArray = await r2Response.Body?.transformToByteArray();
      if (!fileByteArray) {
        return new NextResponse("File not found in storage", { status: 404 });
      }

      return new NextResponse(new Uint8Array(fileByteArray), {
        status: 200,
        headers: downloadHeaders,
      });
    }

    const template = React.createElement(
      Document,
      { title: "Admission Letter" },
      React.createElement(AdmissionLetterTemplate, formattedData),
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
        name: fileKey,
        type: "Admission Letter",
        hash: hashToken,
        admissionId,
      },
    });

    return new NextResponse(new Uint8Array(pdf), {
      status: 200,
      headers: downloadHeaders,
    });
  } catch (error) {
    console.error("An error has occurred", error);
    return NextResponse.json(
      { error: "Something went wrong!" },
      { status: 500 },
    );
  }
};
