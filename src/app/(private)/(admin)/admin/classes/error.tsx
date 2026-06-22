/**biome-ignore-all assist/source/organizeImports:reason */
"use client";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("ClassesPage Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-100 gap-4">
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground">
        We couldn't load the classes, departments, or staff data.
      </p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
