import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { sendMail } from "@/lib/resend-config";
import { getEmailBatchConfig } from "@/utils/email-batch-config";

export async function POST(req: NextRequest) {
  try {
    const { emails } = (await req.json()) as {
      emails: {
        to: string[];
        username: string;
        data: { lastName: string; email: string; password: string };
      }[];
    };

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      console.error("Missing or invalid emails array");
      return Response.json(
        { error: "Missing or invalid emails array" },
        { status: 400 }
      );
    }

    console.log(`Processing batch of ${emails.length} emails`);

    // Get batch configuration
    const config = getEmailBatchConfig();
    const results = [];

    for (let i = 0; i < emails.length; i += config.batchSize) {
      const batch = emails.slice(i, i + config.batchSize);

      console.log(
        `Processing batch ${Math.floor(i / config.batchSize) + 1}/${Math.ceil(emails.length / config.batchSize)}`
      );

      const batchPromises = batch.map(async (emailData) => {
        try {
          const { to, username, data } = emailData;

          if (!to || !username || !data) {
            throw new Error(
              `Missing required fields for email: ${to || "unknown"}`
            );
          }

          const emailResponse = await sendMail({ to, username, data });

          if (emailResponse.error) {
            throw new Error(
              `Failed to send email to ${to}: ${emailResponse.error}`
            );
          }

          return { success: true, email: to };
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : "Unknown error";
          console.error(
            `Error sending email to ${emailData.to}:`,
            errorMessage
          );
          return { success: false, email: emailData.to, error: errorMessage };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add delay between batches to avoid overwhelming the email service
      if (i + config.batchSize < emails.length) {
        await new Promise((resolve) => setTimeout(resolve, config.batchDelay));
      }
    }

    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success);

    console.log(
      `Batch email processing completed: ${successful} successful, ${failed.length} failed`
    );

    if (failed.length > 0) {
      console.error("Failed emails:", failed);
    }

    return Response.json(
      {
        success: true,
        total: emails.length,
        successful,
        failed: failed.length,
        errors: failed.map((f) => ({ email: f.email, error: f.error })),
      },
      { status: 200 }
    );
  } catch (e) {
    console.error("Error in batch email processing:", e);
    Sentry.captureException(e);
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    return Response.json(
      { error: `Batch email processing failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
