// lib/pusher-client.ts
import Pusher from "pusher-js";

let pusherInstance: Pusher | null = null;

export function getPusherClient(key: string, cluster: string) {
  if (typeof window === "undefined") return null;
  if (pusherInstance) return pusherInstance;
  if (!key) return null;

  pusherInstance = new Pusher(key, {
    cluster,
    authEndpoint: undefined, // if using private/auth channels set auth endpoint
    forceTLS: true,
  });

  return pusherInstance;
}
