import { triggerServerNotification } from "@/lib/pusher";
import { sendMail } from "@/lib/resend-config";
import { BulkEmailType } from "@/lib/types";
import { getEmailBatchConfig } from "@/utils/email-batch-config";
import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve<BulkEmailType>(async (context) => {
  const { emails, userId, source } = context.requestPayload;
  const channelName = `userId-${userId}`;
  const config = getEmailBatchConfig();

  let totalSuccessful = 0;

  for (let i = 0; i < emails.length; i += config.batchSize) {
    const batch = emails.slice(i, i + config.batchSize);

    const batchResult = await context.run(
      `send-batch-${source}-${i}`,
      async () => {
        try {
          const response = await sendMail(batch);
          if (response.error) throw new Error(response.error);

          return { successCount: batch.length };
        } catch (err) {
          console.error("Batch failed, falling back to individual sends", err);

          const individualResults = await Promise.all(
            batch.map(async (emailData) => {
              try {
                const res = await sendMail(emailData);
                return !res.error;
              } catch {
                return false;
              }
            }),
          );
          return { successCount: individualResults.filter(Boolean).length };
        }
      },
    );

    totalSuccessful += batchResult.successCount;

    await context.run(`notify-progress-${source}-${i}`, async () => {
      await triggerServerNotification(
        channelName,
        `${source}-emails-sending-progress`,
        {
          sent: totalSuccessful,
          total: emails.length,
          message: `Processed ${Math.min(i + config.batchSize, emails.length)} of ${emails.length} emails.`,
          type: "info",
        },
      );
    });

    if (i + config.batchSize < emails.length) {
      await context.sleep(`wait-after-batch-${i}`, config.batchDelay / 1000);
    }
  }

  await context.run("final-completion-notification", async () => {
    await triggerServerNotification(
      channelName,
      `${source}-emails-sent-completed`,
      {
        message: `${source} email processing completed: ${totalSuccessful} successful.`,
        type: "success",
      },
    );
  });
});
