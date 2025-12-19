import * as Sentry from "@sentry/nextjs";
import { resend } from "@/lib/resend-config";
import { ResetPasswordTemplate } from "@/email-templates/reset-password-template";
import { EmailVerificationTemplate } from "@/email-templates/email-verification-template";
import { env } from "@/lib/server-only-actions/validate-env";
import React from "react";

type MailProps = {
  to: string;
  url: string;
  subject?: string;
  type?: "verification" | "reset";
};

export const sendEmail = async (mailProps: MailProps) => {
  try {
    const { type = "reset", subject } = mailProps;

    const emailSubject =
      subject ||
      (type === "verification"
        ? "Verify your email"
        : "Password Reset Request");

    let reactElement: React.ReactElement;

    if (type === "verification") {
      reactElement = React.createElement(EmailVerificationTemplate, {
        verificationUrl: mailProps.url,
        userEmail: mailProps.to,
      });
    } else {
      reactElement = React.createElement(ResetPasswordTemplate, {
        resetUrl: mailProps.url,
        userEmail: mailProps.to,
      });
    }

    const { error } = await resend.emails.send({
      from: `Presby SHTS <${env.RESEND_FROM_EMAIL}>`,
      to: mailProps.to,
      subject: emailSubject,
      react: reactElement,
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
