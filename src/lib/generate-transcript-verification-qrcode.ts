import * as Sentry from "@sentry/nextjs";
import Qrcode from "qrcode";
import { env } from "./server-only-actions/validate-env";

export const generateTranscriptVerificationQrcode = async (
  studentId: string,
) => {
  try {
    const verificationPageUrl = `${env.NEXT_PUBLIC_URL}/verify-student-transcript/${studentId}`;

    const qrcodeData = await Qrcode.toDataURL(verificationPageUrl, {
      type: "image/png",
      width: 150,
      color: { dark: "#0d00a4", light: "#ffffff" },
    });

    return qrcodeData;
  } catch (e) {
    console.error("Failed to generate transcript verification qrcode", e);
    Sentry.captureException(e);
    return "";
  }
};
