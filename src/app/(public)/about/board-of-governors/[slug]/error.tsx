/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function BoardMemberErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <Card className="shadow-2xl rounded-none">
      <CardHeader className="text-center border-b">
        <CardHeader className="text-lg font-bold text-destructive">
          An Error Has Occurred
        </CardHeader>
        <CardDescription>{error.message}</CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button onClick={reset}>Try Again!</Button>
      </CardContent>
    </Card>
  );
}
