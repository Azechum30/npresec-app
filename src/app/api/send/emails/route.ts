import { arcjetRatelimit } from "@/lib/arcjet";
import { triggerServerNotification } from "@/lib/pusher";
import { sendMail } from "@/lib/resend-config";
import * as Sentry from "@sentry/nextjs";
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs";
import { NextRequest } from "next/server";

async function handler(req: NextRequest) {
  let channelName = "";
  try {
    const { to, username, data, source, userId } = await req.json();
    if (!to || !username || !data || !source || !userId) {
      console.error("missing required fields");
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const eventPrefix =
      source === "staff" ? "Staff" : source === "students" ? "Student" : "User";

    const errorEventName = `Error-sending-${eventPrefix.toLowerCase()}-email`;
    const successEventName = `${eventPrefix}-email-sending-complete`;

    const errorMessage = `Failed to send ${eventPrefix.toLowerCase()} email`;
    const successMessage = `${eventPrefix} email successfully sent`;

    channelName = `userId-${userId}`;

    const { error } = await arcjetRatelimit(userId);

    if (error) {
      await triggerServerNotification(channelName, "rate-limit-exceeded", {
        message: error,
        type: "error",
      });

      return Response.json({ error }, { status: 429 });
    }

    const emailResponse = await sendMail({ to, username, data });

    if (emailResponse.error) {
      console.error("error sending email", emailResponse.error);

      await triggerServerNotification(channelName, errorEventName, {
        message: errorMessage,
        type: "error",
      });

      return Response.json({ error: emailResponse.error }, { status: 500 });
    }

    await triggerServerNotification(channelName, successEventName, {
      message: successMessage,
      type: "success",
    });

    return Response.json({ success: true }, { status: 200 });
  } catch (e) {
    console.error("Error sending email:", e);
    Sentry.captureException(e);

    await triggerServerNotification(channelName, "single-email-server-error", {
      message: "Email service error",
      type: "error",
    });

    e instanceof Error ? e.message : "Unknown error";
    return Response.json({ error: "Error sending email" }, { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);
