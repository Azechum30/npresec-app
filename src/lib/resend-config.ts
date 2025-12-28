import { Resend } from "resend";
import { env } from "./server-only-actions/validate-env";
import { EmailTemplate } from "@/components/customComponents/email-template";
import React from "react";
import * as Sentry from "@sentry/nextjs";

export const resend = new Resend(env.RESEND_API_KEY);

type MailProps = {
  to: string[];
  username: string;
  data: {
    lastName: string;
    email: string;
    password: string;
  };
};

export const sendMail = async (props: MailProps | MailProps[]) => {
  try {
    let result;

    if (Array.isArray(props)) {
      // Batch send
      const mails = (Array.isArray(props) ? props : [props]).map((p) => ({
        from: `Presby SHTS <${env.RESEND_FROM_EMAIL}>`,
        to: p.to,
        subject: "Onboarding",
        react: React.createElement(EmailTemplate, {
          firstName: p.username,
          lastName: p.data.lastName,
          loginCredentials: {
            email: p.data.email,
            password: p.data.password,
          },
          appUrl: env.NEXT_PUBLIC_URL,
        }),
      }));

      result = await resend.batch.send(mails);
    } else {
      // Single send
      const { to, username, data } = props as MailProps;
      result = await resend.emails.send({
        from: `Presby SHTS <${env.RESEND_FROM_EMAIL}>`,
        to,
        subject: "Onboarding",
        react: React.createElement(EmailTemplate, {
          firstName: username,
          lastName: data.lastName,
          loginCredentials: {
            email: data.email,
            password: data.password,
          },
          appUrl: env.NEXT_PUBLIC_URL,
        }),
      });
    }

    if (result.error) {
      return { error: result.error.message };
    }

    return { submitted: true };
  } catch (error) {
    Sentry.captureException(error);
    console.error(error);
    return { error: "Could not send email!" };
  }
};
