"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TriangleAlert } from "lucide-react";
import { useEffect } from "react";

export default function OnlineAdmissionErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="border-t-primary border-t-4 shadow-2xl">
      <CardHeader className="border-b">
        <CardTitle className="flex space-x-2 items-center">
          <span className="size-12 rounded-full bg-destructive p-2">
            <TriangleAlert className="size-8 text-destructive" />
          </span>
          <h1 className="text-xl font-bold bg-linear-120 from-destructive to-primary text-transparent bg-clip-text">
            Unhandled Error!
          </h1>
        </CardTitle>
        <CardDescription className="bg-destructive/10 border-destructive p-4 rounded-md">
          An unexpected error has occurred.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button size="lg" onClick={() => reset()}>
          Try Again
        </Button>
      </CardContent>
    </Card>
  );
}
