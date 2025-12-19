import * as Sentry from "@sentry/nextjs";
import { resend } from "@/lib/resend-config";
import { ResetPasswordTemplate } from "@/email-templates/reset-password-template";
import { env } from "@/lib/server-only-actions/validate-env";
import React from "react";

type MailProps = {
  to: string;
  url: string;
  subject?: string;
};

export const sendResetPasswordEmail = async (mailProps: MailProps) => {
  try {
    const { error } = await resend.emails.send({
      from: `Presby SHTS <${env.RESEND_FROM_EMAIL}>`,
      to: mailProps.to,
      subject: mailProps.subject || "Password Reset Request",
      react: React.createElement(ResetPasswordTemplate, {
        resetUrl: mailProps.url,
      }),
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error("Could not send email:", error);
    return { error: "Could not send email" };
  }
};
