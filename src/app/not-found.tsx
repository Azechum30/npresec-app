import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4">
            <div className="text-6xl font-bold text-muted-foreground/30">
              404
            </div>
          </div>
          <CardTitle className="text-2xl font-semibold text-foreground">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Sorry, we couldn&apos;t find the page you&apos;re looking for. The
            page might have been moved, deleted, or you might have entered an
            incorrect URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className={buttonVariants({
                variant: "default",
                size: "default",
              })}
            >
              Go to Homepage
            </Link>
            <Link
              href="/sign-in"
              className={buttonVariants({
                variant: "outline",
                size: "default",
              })}
            >
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
