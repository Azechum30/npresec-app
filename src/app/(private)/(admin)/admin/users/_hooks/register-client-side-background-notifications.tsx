/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { getQueryClient } from "@/components/providers/get-query-client";
import { pusherClient } from "@/lib/pusher-client";
import { EVENT_TO_QUERY_KEY } from "@/utils/event-query-key";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
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

  const serializedEvents = useMemo(
    () => JSON.stringify([...eventNames].sort()),
    [eventNames],
  );

  useEffect(() => {
    if (!userId) return;

    const channelName = `userId-${userId}`;
    const targetEvents = JSON.parse(serializedEvents) as string[];
    const channel = pusherClient.subscribe(channelName);

    targetEvents.forEach((eventName) => {
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

            const queryKey = EVENT_TO_QUERY_KEY[eventName];
            if (queryKey) {
              queryClient.invalidateQueries({ queryKey });
            }
            router.refresh();
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

    const cleanUpSubscriptions = () => {
      try {
        for (const event of targetEvents) {
          channel.unbind(event);
        }
        pusherClient.unsubscribe(channelName);
      } catch (e) {
        console.error("Failed to cleanly disconnect local user channel:", e);
      }
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        pusherClient.subscribe(channelName);
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("pagehide", cleanUpSubscriptions);

    return () => {
      cleanUpSubscriptions();
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("pagehide", cleanUpSubscriptions);
    };
  }, [userId, serializedEvents, router, queryClient]);

  return null;
};
