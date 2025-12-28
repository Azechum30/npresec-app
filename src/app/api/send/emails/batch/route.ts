import { NextRequest } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { sendMail } from "@/lib/resend-config"; // your wrapper around Resend
import { getEmailBatchConfig } from "@/utils/email-batch-config";
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";

async function handler(req: NextRequest) {
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

    // Get batch configuration (size + delay)
    const config = getEmailBatchConfig();
    const results: {
      success: boolean;
      email: string[];
      error?: string;
    }[] = [];

    for (let i = 0; i < emails.length; i += config.batchSize) {
      const batch = emails.slice(i, i + config.batchSize);

      console.log(
        `Processing batch ${Math.floor(i / config.batchSize) + 1}/${Math.ceil(
          emails.length / config.batchSize
        )}`
      );

      try {
        // Try batch send first
        const batchResponse = await sendMail(batch); // sendMail detects array → batch send

        if (batchResponse.error) {
          throw new Error(batchResponse.error);
        }

        results.push(...batch.map((e) => ({ success: true, email: e.to })));
      } catch (err) {
        console.error("Batch send failed, falling back to single sends:", err);

        // Fallback: send individually
        const batchResults = await Promise.all(
          batch.map(async (emailData) => {
            try {
              const emailResponse = await sendMail(emailData); // single send
              if (emailResponse.error) {
                throw new Error(emailResponse.error);
              }
              return { success: true, email: emailData.to };
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : "Unknown error";
              console.error(
                `Error sending email to ${emailData.to}:`,
                errorMessage
              );
              return {
                success: false,
                email: emailData.to,
                error: errorMessage,
              };
            }
          })
        );

        results.push(...batchResults);
      }

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

export const POST = verifySignatureAppRouter(handler);
