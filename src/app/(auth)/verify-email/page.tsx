import LoadingState from "@/components/customComponents/Loading";
import { ResendVerificationEmailButton } from "@/components/customComponents/resend-verification-email";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthUser, getUserRole, isEmailVerified } from "@/lib/get-session";
import { unauthorized } from "next/navigation";

import { priorityRoles, UserRole } from "@/lib/types";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

// export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          A verification email has been sent to your email address. Please check
          your inbox and click the verification link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<LoadingState />}>
          <RenderResendVerificationButton />
        </Suspense>
      </CardContent>
    </Card>
  );
}

const RenderResendVerificationButton = async () => {
  await connection();
  const [userRole, hasEmailVerified, user] = await Promise.all([
    getUserRole(),
    isEmailVerified(),
    getAuthUser(),
  ]);
  const priorityRole = priorityRoles.find((r) =>
    userRole?.includes(r as UserRole),
  );
  if (!priorityRole || !user) return unauthorized();

  if (hasEmailVerified && priorityRole === "admin")
    return redirect("/admin/dashboard");
  if (hasEmailVerified && priorityRole === "teacher")
    return redirect("/teachers");
  if (hasEmailVerified && priorityRole === "student")
    return redirect("/students");

  return <ResendVerificationEmailButton email={user.email} />;
};
