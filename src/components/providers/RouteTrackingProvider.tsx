"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { isValidCallbackUrl } from "@/utils/auth-redirects";

interface RouteEntry {
  path: string;
  timestamp: number;
  isManualNavigation?: boolean;
}

interface RouteTrackingContextType {
  getCallbackUrl: () => string | null;
  isManualNavigation: () => boolean;
  resetHistory: () => void;
  getCurrentRoute: () => RouteEntry | null;
  getPreviousRoute: () => RouteEntry | null;
}

const RouteTrackingContext = createContext<RouteTrackingContextType | null>(
  null,
);

interface RouteTrackingProviderProps {
  children: React.ReactNode;
}

export default function RouteTrackingProvider({
  children,
}: RouteTrackingProviderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const historyRef = useRef<RouteEntry[]>([]);
  const currentRef = useRef<RouteEntry | null>(null);
  const previousRef = useRef<RouteEntry | null>(null);
  const lastPathRef = useRef<string>("");
  const navigationTimeRef = useRef<number>(Date.now());

  // Storage key for persisting route history
  const storageKey = "npresec-route-history";

  // Load from sessionStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        historyRef.current = data.history || [];
        currentRef.current = data.current || null;
        previousRef.current = data.previous || null;
      }
    } catch (error) {
      console.warn("Failed to load route history:", error);
    }
  }, []);

  // Save to sessionStorage
  const saveToStorage = () => {
    if (typeof window === "undefined") return;

    try {
      const data = {
        history: historyRef.current.slice(-10), // Keep only last 10 entries
        current: currentRef.current,
        previous: previousRef.current,
      };
      sessionStorage.setItem(storageKey, JSON.stringify(data));
    } catch (error) {
      console.warn("Failed to save route history:", error);
    }
  };

  // Track route changes
  useEffect(() => {
    if (!pathname || pathname === lastPathRef.current) return;

    const now = Date.now();
    const timeSinceLastNav = now - navigationTimeRef.current;

    // Consider it manual navigation if:
    // 1. More than 2 seconds since last navigation
    // 2. User likely typed URL or used browser navigation
    const isManual =
      timeSinceLastNav > 2000 || performance.navigation?.type === 1;

    const newEntry: RouteEntry = {
      path: pathname,
      timestamp: now,
      isManualNavigation: isManual,
    };

    // Update refs
    previousRef.current = currentRef.current;
    currentRef.current = newEntry;
    historyRef.current.push(newEntry);

    // Keep only recent history
    if (historyRef.current.length > 10) {
      historyRef.current = historyRef.current.slice(-10);
    }

    // Update tracking vars
    lastPathRef.current = pathname;
    navigationTimeRef.current = now;

    // Save to storage
    saveToStorage();

    // Debug logging
    if (process.env.NODE_ENV === "development") {
      console.log("🛣️ Route tracked:", {
        path: pathname,
        isManual,
        previous: previousRef.current?.path,
        timeSinceLastNav,
      });
    }
  }, [pathname]);

  // Context methods
  const getCallbackUrl = (): string | null => {
    const excludePaths = [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/reset-password",
      "/",
      "/about",
    ];

    // First try previous route
    if (
      previousRef.current?.path &&
      isValidCallbackUrl(previousRef.current.path) &&
      !excludePaths.includes(previousRef.current.path)
    ) {
      return previousRef.current.path;
    }

    // Then search history backwards
    for (let i = historyRef.current.length - 1; i >= 0; i--) {
      const entry = historyRef.current[i];
      if (
        isValidCallbackUrl(entry.path) &&
        !excludePaths.includes(entry.path) &&
        entry.path !== currentRef.current?.path
      ) {
        return entry.path;
      }
    }

    return null;
  };

  const isManualNavigation = (): boolean => {
    if (!currentRef.current) return false;

    // Check if explicitly marked as manual
    if (currentRef.current.isManualNavigation) return true;

    // Check time gap between navigations
    if (previousRef.current) {
      const timeDiff =
        currentRef.current.timestamp - previousRef.current.timestamp;
      return timeDiff > 2000; // 2 second threshold
    }

    return false;
  };

  const resetHistory = (): void => {
    historyRef.current = [];
    currentRef.current = null;
    previousRef.current = null;

    if (typeof window !== "undefined") {
      sessionStorage.removeItem(storageKey);
    }
  };

  const getCurrentRoute = (): RouteEntry | null => {
    return currentRef.current;
  };

  const getPreviousRoute = (): RouteEntry | null => {
    return previousRef.current;
  };

  const contextValue: RouteTrackingContextType = {
    getCallbackUrl,
    isManualNavigation,
    resetHistory,
    getCurrentRoute,
    getPreviousRoute,
  };

  return (
    <RouteTrackingContext.Provider value={contextValue}>
      {children}
    </RouteTrackingContext.Provider>
  );
}

// Hook to use route tracking
export function useRouteTracking(): RouteTrackingContextType {
  const context = useContext(RouteTrackingContext);

  if (!context) {
    throw new Error(
      "useRouteTracking must be used within a RouteTrackingProvider",
    );
  }

  return context;
}

// Utility to get callback URL outside React components (for server actions)
export function getStoredCallbackUrl(): string | null {
  // Always return null on server-side to prevent SSR errors
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem("npresec-route-history");
    if (!stored) return null;

    const data = JSON.parse(stored);
    const excludePaths = [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/reset-password",
      "/",
      "/about",
    ];

    // Try previous route first
    if (
      data.previous?.path &&
      isValidCallbackUrl(data.previous.path) &&
      !excludePaths.includes(data.previous.path)
    ) {
      return data.previous.path;
    }

    // Search history
    const history = data.history || [];
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i];
      if (
        isValidCallbackUrl(entry.path) &&
        !excludePaths.includes(entry.path) &&
        entry.path !== data.current?.path
      ) {
        return entry.path;
      }
    }
  } catch (error) {
    // Silently handle errors to prevent server-side issues
    if (process.env.NODE_ENV === "development") {
      console.warn("Failed to get stored callback URL:", error);
    }
  }

  return null;
}
