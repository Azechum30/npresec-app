/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function StudentsErrorPage({
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
    <Card className="shadow-2xl">
      <CardHeader className="border-b">
        <CardTitle>An Error has Occurred</CardTitle>
        <CardDescription>
          Unknown error has occurred in the student&apos;s page{" "}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset}>Retry</Button>
      </CardContent>
    </Card>
  );
}
