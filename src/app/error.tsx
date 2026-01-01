"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console
    console.error("Global error caught:", error);
  }, [error]);

  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-destructive/10 rounded-full w-fit">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Something went wrong
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">
              We encountered an unexpected error. Please try again or return to
              the homepage.
            </p>
          </div>

          {/* Development error details */}
          {isDevelopment && (
            <div className="space-y-3">
              <details className="group">
                <summary className="cursor-pointer text-sm font-medium text-destructive hover:text-destructive/80 transition-colors">
                  <span className="group-open:hidden">Show error details</span>
                  <span className="hidden group-open:inline">
                    Hide error details
                  </span>
                </summary>
                <div className="mt-3 p-4 bg-muted rounded-lg border">
                  <div className="space-y-2 text-xs font-mono">
                    <div>
                      <span className="font-semibold">Message:</span>
                      <div className="mt-1 text-destructive">
                        {error.message}
                      </div>
                    </div>
                    {error.digest && (
                      <div>
                        <span className="font-semibold">Digest:</span>
                        <div className="mt-1 text-muted-foreground">
                          {error.digest}
                        </div>
                      </div>
                    )}
                    {error.stack && (
                      <div>
                        <span className="font-semibold">Stack Trace:</span>
                        <pre className="mt-1 text-xs overflow-x-auto whitespace-pre-wrap text-muted-foreground">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* Recovery actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={reset}
              variant="default"
              size="default"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>

            <Link href="/">
              <Button
                variant="outline"
                size="default"
                className="flex items-center gap-2 w-full sm:w-auto"
              >
                <Home className="h-4 w-4" />
                Go to Homepage
              </Button>
            </Link>
          </div>

          {/* Error ID for support reference */}
          {error.digest && (
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Error ID: <code className="font-mono">{error.digest}</code>
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
