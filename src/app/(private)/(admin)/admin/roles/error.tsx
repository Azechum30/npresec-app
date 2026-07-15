/** biome-ignore-all assist/source/organizeImports: reason */
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

const RolesErrorPage = ({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) => {
  useEffect(() => {
    Sentry.captureException(error);
    console.error("An unexpected error has occurred", error);
  }, [error]);

  return (
    <Card className="w-full sm:mx-w-sm sm:mx-auto">
      <CardHeader className="border-b">
        <CardTitle className="text-xl text-destructive">Error</CardTitle>
        <CardDescription>
          An unexpected error has occured. Please try again!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          type="button"
          role="button"
          aria-label="role-error-reload-button"
          onClick={reset}>
          Try Again!
        </Button>
      </CardContent>
    </Card>
  );
};

export default RolesErrorPage;
