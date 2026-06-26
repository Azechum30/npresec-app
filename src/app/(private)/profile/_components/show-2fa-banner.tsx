/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useAuth } from "@/components/customComponents/SessionProvider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react"; // Assuming you have lucide-react installed
import Link from "next/link";
import { useEffect, useState } from "react";

export const Show2FABanner = () => {
  const user = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  // Check localStorage on mount to see if user already dismissed it
  useEffect(() => {
    const isDismissed = localStorage.getItem("2fa-banner-dismissed");
    if (!isDismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("2fa-banner-dismissed", "true");
  };

  if (!user || user.twoFactorEnabled || !isVisible) return null;

  return (
    <div
      className="border-primary border-l-4 p-4 mb-6 flex items-center justify-between rounded-md shadow-2xl"
      role="alert">
      <p>
        We highly recommend enabling two factor authentication (2FA) for your
        account to enhance its security.
      </p>
      <div className="flex items-center gap-4">
        <Button asChild variant="outline">
          <Link href="/setup-2fa">Enable 2FA</Link>
        </Button>
        <Button
          type="button"
          onClick={handleDismiss}
          className="hover:bg-primary/20 p-1 rounded-[50%] transition-colors size-6"
          aria-label="Dismiss banner">
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
};
