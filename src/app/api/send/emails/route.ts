import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { sendMail } from "@/lib/resend-config";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

async function handler(req: NextRequest) {
  try {
    const { to, username, data } = await req.json();
    if (!to || !username || !data) {
      console.error("missing required fields");
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const emailResponse = await sendMail({ to, username, data });

    if (emailResponse.error) {
      console.error("error sending email", emailResponse.error);
      return Response.json({ error: emailResponse.error }, { status: 500 });
    }

    console.log("email sent successfully");

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Error sending email:", e);
    Sentry.captureException(e);
    e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: "Error sending email" }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
