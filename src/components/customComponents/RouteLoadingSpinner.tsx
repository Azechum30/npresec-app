"use client";

import { Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface RouteLoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  fullScreen?: boolean;
}

export default function RouteLoadingSpinner({
  message = "Loading...",
  size = "md",
  className,
  fullScreen = false,
}: RouteLoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
    : "w-full";

  return (
    <div
      className={cn(
        "flex items-center justify-center",
        containerClasses,
        fullScreen ? "min-h-screen" : "py-8",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex flex-col items-center space-y-2">
        <Loader
          className={cn(
            "animate-spin text-primary",
            sizeClasses[size]
          )}
          aria-hidden="true"
        />
        {message && (
          <p
            className={cn(
              "text-muted-foreground font-medium",
              textSizes[size]
            )}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

// Preset variants for common use cases
export function RouteLoadingFullScreen({ message }: { message?: string }) {
  return (
    <RouteLoadingSpinner
      message={message}
      size="lg"
      fullScreen={true}
      className="flex items-center justify-center"
    />
  );
}

export function RouteLoadingInline({ message }: { message?: string }) {
  return (
    <RouteLoadingSpinner
      message={message}
      size="sm"
      className="py-4"
    />
  );
}

export function RouteLoadingCard({ message }: { message?: string }) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <RouteLoadingSpinner
        message={message}
        size="md"
        className="py-2"
      />
    </div>
  );
}
