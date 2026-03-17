"use client";
import { useSessionExpirationCountdown } from "@/hooks/useSessionExpireCountdown";

export const Timer = () => {
  const timer = useSessionExpirationCountdown();

  if (!timer) {
    return null;
  }

  if (timer === "Expired") {
    return <div className="text-destructive">Session {timer}</div>;
  }

  return (
    <div className="hidden lg:flex px-3 py-1 rounded-md border bg-background">
      <h3 className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
        Expires in {timer}
      </h3>
    </div>
  );
};
