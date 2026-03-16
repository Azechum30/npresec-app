import { authClient } from "@/lib/auth-client";
import { startTransition, useEffect, useState } from "react";

export const useSessionExpirationCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  const { data: session } = authClient.useSession();

  useEffect(() => {
    if (!session?.session.expiresAt) {
      startTransition(() => {
        setTimeLeft(null);
      });

      return;
    }

    const targetTime = new Date(session.session.expiresAt).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();

      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      const formatted = [
        hours.toString().padStart(2, "0"),
        minutes.toString().padStart(2, "0"),
        seconds.toString().padStart(2, "0"),
      ].join(":");

      setTimeLeft(formatted);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [session]);

  return timeLeft;
};
