/** biome-ignore-all assist/source/organizeImports:reason */

import { triggerServerNotification } from "@/lib/pusher";
import { env } from "@/lib/server-only-actions/validate-env";
import type { SMSWorkflowDataType } from "@/lib/types";
import { serve } from "@upstash/workflow/dist/nextjs";

export const { POST } = serve<SMSWorkflowDataType>(
  async (context) => {
    const { message, userId, to } = context.requestPayload;

    const formattedPhone = to.trim().replace(/\s+/g, "");

    const messageTo = formattedPhone.startsWith("0")
      ? `233${formattedPhone.slice(1)}`
      : formattedPhone.startsWith("+")
        ? `${formattedPhone.slice(1)}`
        : formattedPhone;

    await context.run("send-sms", async () => {
      const response = await fetch(env.ARKESEL_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": env.ARKESEL_API_KEY,
        },
        body: JSON.stringify({
          sender: env.ARKESEL_SENDER_ID,
          recipients: [messageTo],
          message,
        }),
      });

      const data = await response.json();

      console.log("SMS response", data);

      return data;
    });

    await context.run("send-notification", async () => {
      await triggerServerNotification(`userId-${userId}`, "sms-sent-success", {
        message: "Student parent or guardian duly notified",
        type: "success",
      });
    });
  },
  {
    baseUrl: env.UPSTASH_WORKFLOW_URL,
  },
);
