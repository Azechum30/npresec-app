import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserRole, isEmailVerified } from "@/lib/get-session";
import { priorityRoles, UserRole } from "@/lib/types";
import Link from "next/link";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <RenderEmailVerifiedPage />
    </Suspense>
  );
}

const RenderEmailVerifiedPage = async () => {
  const [userRole, hasVerifiedEmail] = await Promise.all([
    getUserRole(),
    isEmailVerified(),
  ]);
  const priorityRole = priorityRoles.find((role) =>
    userRole?.includes(role as UserRole),
  );

  if (!priorityRole || !hasVerifiedEmail) return unauthorized();

  const url =
    priorityRole === "admin"
      ? "/admin/dashboard"
      : priorityRole === "teaching_staff"
        ? "/teachers"
        : priorityRole === "student"
          ? "/students"
          : "/";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email Verified Successfully!</CardTitle>
        <CardDescription>
          Your email has been verified and your account is now active. You can
          now access all features of the platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link
          href={url}
          className={buttonVariants({
            variant: "default",
            className: "w-full",
          })}>
          Continue to Dashboard
        </Link>
      </CardContent>
    </Card>
  );
};
