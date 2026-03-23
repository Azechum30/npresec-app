import "server-only";

import Pusher from "pusher";
import { env } from "./server-only-actions/validate-env";

export const pusher = new Pusher({
  appId: env.PUSHER_APP_ID,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_SECRET,
  useTLS: true,
});

export const triggerServerNotification = async (
  channel: string | string[],
  event: string,
  data: {
    sent?: number;
    failed?: number;
    total?: number;
    message: string;
    type: "error" | "success" | "warning" | "info";
  },
) => {
  await pusher.trigger(channel, event, data);
};
