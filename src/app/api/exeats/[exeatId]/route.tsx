/** biome-ignore-all assist/source/organizeImports: reason */

import { ExeatCheatTemplate } from "@/app/(private)/exeats/_components/exeat-chit-template";
import { generateGenericQRCode } from "@/lib/generate-generic-qrcode";
import { getUserPermissions } from "@/lib/get-session";
import { env } from "@/lib/server-only-actions/validate-env";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

export const GET = async (
  req: Request,
  {
    params,
  }: {
    params: Promise<{ exeatId: string }>;
  },
) => {
  try {
    const { hasPermission } = await getUserPermissions("create:exeats");
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const { exeatId } = await params;

    if (!exeatId) {
      return NextResponse.json(
        { error: "Invalid parameter received" },
        { status: 400 },
      );
    }

    const exeatData = await globalThis.$client?.exeat.getExeatRequest(exeatId);
    if (!exeatData) {
      return NextResponse.json(
        { message: "No resource found" },
        { status: 404 },
      );
    }
    const url = `${env.NEXT_PUBLIC_URL}/exeats/check-out-or-check-in/${exeatId}`;

    const qrCodeData = await generateGenericQRCode(url);

    const buffer = await renderToBuffer(
      <ExeatCheatTemplate
        data={exeatData}
        QRcodeUrl={qrCodeData}
        verificationURL={url}
      />,
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${exeatData.student.lastName}-${exeatData.student.firstName}-exeat-slip.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to download exeat chit", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
