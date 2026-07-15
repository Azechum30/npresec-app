/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { getPusherClient } from "@/lib/get-pusher-client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { getQueryClient } from "../providers/get-query-client";

type SafeQueryKey = readonly unknown[] | unknown[];

type InvalidationConfig = Record<string, SafeQueryKey | SafeQueryKey[]>;

type InvalidateCachesProviderProps = {
  eventsConfig: InvalidationConfig;
  pusherKey: string;
  cluster: string;
};

export const InvalidateCachesProvider = ({
  eventsConfig,
  pusherKey,
  cluster,
}: InvalidateCachesProviderProps) => {
  const normalizedConfig = useMemo(() => {
    const config: Record<string, unknown[][]> = {};

    for (const [eventName, keys] of Object.entries(eventsConfig)) {
      config[eventName] = (Array.isArray(keys) ? keys : [keys]) as unknown[][];
    }

    return config;
  }, [eventsConfig]);
  const router = useRouter();

  const serializedConfig = JSON.stringify(normalizedConfig);

  useEffect(() => {
    const pusherClient = getPusherClient(pusherKey, cluster);
    if (!pusherClient) return;

    const queryClient = getQueryClient();
    const channelName = "cache-invalidation-settings";

    const targetConfig = JSON.parse(serializedConfig) as Record<
      string,
      unknown[][]
    >;

    pusherClient.subscribe(channelName);

    const registeredHandlers: Record<string, () => void> = {};

    for (const [eventName, keysToInvalidate] of Object.entries(targetConfig)) {
      const handler = () => {
        for (const key of keysToInvalidate) {
          queryClient.invalidateQueries({ queryKey: key });
          router.refresh();
        }
      };

      registeredHandlers[eventName] = handler;
      pusherClient.bind(eventName, handler);
    }

    return () => {
      try {
        pusherClient.unsubscribe(channelName);
        for (const [eventName, handler] of Object.entries(registeredHandlers)) {
          pusherClient.unbind(eventName, handler);
        }
      } catch (e) {
        console.error("Failed to cleanly release active Pusher bindings:", e);
      }
    };
  }, [pusherKey, cluster, serializedConfig, router]);

  return null;
};
