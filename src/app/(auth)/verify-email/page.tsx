import LoadingState from "@/components/customComponents/Loading";
import { ResendVerificationEmailButton } from "@/components/customComponents/resend-verification-email";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthUser } from "@/lib/getAuthUser";
import { unauthorized } from "next/navigation";

import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function VerifyEmailPage() {
  // Check if user is already verified on page load
  const user = await getAuthUser();

  if (user && user.emailVerified) {
    const url =
      user.role?.name === "admin"
        ? "/admin/dashboard"
        : user.role?.name === "teacher"
          ? "/teachers"
          : user.role?.name === "student"
            ? "/students"
            : "/";

    redirect(url);
  }

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

export const RenderResendVerificationButton = async () => {
  const user = await getAuthUser();

  if (!user) return unauthorized();

  if (user.emailVerified && user.role?.name === "admin")
    return redirect("/admin/dashboard");
  if (user.emailVerified && user.role?.name === "teacher")
    return redirect("/teachers");
  if (user.emailVerified && user.role?.name === "student")
    return redirect("/students");

  return <ResendVerificationEmailButton email={user.email} />;
};
