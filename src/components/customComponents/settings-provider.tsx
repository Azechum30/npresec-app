"use client";

import {
  SystemSettings,
  useSystemWideActionsStore,
} from "@/hooks/use-system-wide-actions-store";
import { getPusherClient } from "@/lib/get-pusher-client";
import { useEffect } from "react";

type Props = {
  initial?: SystemSettings | null;
  pusherKey?: string;
  cluster: string;
};

export default function SettingsProvider({
  initial = null,
  pusherKey,
  cluster,
}: Props) {
  const setSettings = useSystemWideActionsStore((s) => s.setSettings);

  useEffect(() => {
    if (initial) setSettings(initial);

    if (!pusherKey) return;

    const pusher = getPusherClient(pusherKey, cluster);
    if (!pusher) return;

    const channel = pusher.subscribe("system-settings");

    const handler = (payload: SystemSettings) => {
      const cur = useSystemWideActionsStore.getState().settings;
      if (
        cur?.updatedAt &&
        payload?.updatedAt &&
        new Date(payload.updatedAt) <= new Date(cur.updatedAt)
      ) {
        return;
      }
      setSettings(payload);
    };

    channel.bind("settings-updated", handler);

    return () => {
      try {
        channel.unbind("settings-updated", handler);
        pusher.unsubscribe("system-settings");
      } catch {}
    };
  }, [initial, pusherKey, cluster, setSettings]);

  return null;
}
