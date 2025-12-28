"use client";

import { ReactNode, useEffect, useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import SessionProvider from "./SessionProvider";
import { checkAuthAction } from "@/app/actions/auth-actions";

interface ClientAuthGuardProps {
  children: ReactNode;
}

export default function ClientAuthGuard({ children }: ClientAuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    startTransition(() => setIsHydrated(true));
  }, []);

  useEffect(() => {
    // Only run auth check after hydration
    if (!isHydrated) return;

    const checkAuth = async () => {
      try {
        const result = await checkAuthAction();

        if (!result.success || !result.user) {
          router.push("/sign-in");
          return;
        }

        setUserData(result.user);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/sign-in");
      }
    };

    checkAuth();
  }, [router, isHydrated]);

  // Show loading state while hydrating or checking auth
  if (!isHydrated || isAuthenticated === null) {
    return (
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  return <SessionProvider value={userData}>{children}</SessionProvider>;
}
