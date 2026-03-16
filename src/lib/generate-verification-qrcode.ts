import * as Sentry from "@sentry/nextjs";
import QRcode from "qrcode";
import { env } from "./server-only-actions/validate-env";

export const generateQrcode = async (
  studentId: string,
  semester: string,
  academicYear: number,
) => {
  const params = new URLSearchParams({
    semester: semester,
    academicYear: academicYear.toString(),
  });

  const validationUrl = `${env.NEXT_PUBLIC_URL}/verfiy-results/${studentId}?${params}`;

  try {
    const dataUrl = await QRcode.toDataURL(validationUrl, {
      width: 200,
      margin: 2,
      color: { dark: "#0d00a4", light: "#ffffff" },
    });

    return dataUrl;
  } catch (e) {
    console.error("Could not verify student results: ", e);
    Sentry.captureException(e);
    return "";
  }
};
