import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthUser } from "@/lib/getAuthUser";
import Link from "next/link";
import { unauthorized } from "next/navigation";

export default async function EmailVerifiedPage() {
  const user = await getAuthUser();

  if (!user) return unauthorized();

  if (!user.emailVerified) {
    return unauthorized();
  }

  const url =
    user.role?.name === "admin"
      ? "/admin/dashboard"
      : user.role?.name === "teacher"
        ? "/teachers"
        : user.role?.name === "student"
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
}
