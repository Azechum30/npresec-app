"use client";

import { getQueryClient } from "@/components/providers/get-query-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { orpc } from "@/lib/orpc-react-query-client";
import { useEffect } from "react";

export default function ExeatsErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    const queryClient = getQueryClient();
    queryClient.invalidateQueries({
      queryKey: orpc.exeat.getExeatsRequest.key(),
    });
    console.error(error);
  }, [error]);

  return (
    <Card className="max-w-xs mx-auto">
      <CardHeader>
        <CardTitle className="font-bold text-base text-destructive">
          An Error Occurred!
        </CardTitle>
        <CardDescription>{error.message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={reset}>Try Again!</Button>
      </CardContent>
    </Card>
  );
}
