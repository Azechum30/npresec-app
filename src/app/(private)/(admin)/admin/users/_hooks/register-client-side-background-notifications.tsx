/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { getQueryClient } from "@/components/providers/get-query-client";
import { pusherClient } from "@/lib/pusher-client";
import { EVENT_TO_QUERY_KEY } from "@/utils/event-query-key";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const RegisterClientSideBackgroundNotifications = ({
  eventNames,
  userId,
}: {
  eventNames: string[];
  userId: string;
}) => {
  const router = useRouter();
  const queryClient = getQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channelName = `userId-${userId}`;
    const channel = pusherClient?.subscribe(channelName);

    eventNames.forEach((eventName) => {
      channel.bind(
        eventName,
        (data: {
          sent?: number;
          failed?: number;
          total?: number;
          message: string;
          type: "error" | "success" | "warning" | "info";
        }) => {
          if (data.type === "error") {
            toast.error(data.message);
          } else if (data.type === "success") {
            toast.success(data.message);
            router.refresh();

            const queryKey = EVENT_TO_QUERY_KEY[eventName];

            if (queryKey) {
              queryClient.invalidateQueries({ queryKey });
            }
          } else if (data.type === "info") {
            toast.info(data.message, {
              description:
                data.sent && data.total
                  ? `${data.sent} out of ${data.total} emails have sent successfully`
                  : "",
            });
          } else {
            toast.warning(data.message, {
              description:
                data.failed && data.sent
                  ? `${data.sent} emails were sent. However, ${data.failed} emails failed to be sent`
                  : "",
            });
          }
        },
      );
    });

    return () => {
      for (const event of eventNames) {
        channel.unbind(event);
      }
      pusherClient.unsubscribe(channelName);
    };
  }, [userId, eventNames, router, queryClient]);

  return null;
};
