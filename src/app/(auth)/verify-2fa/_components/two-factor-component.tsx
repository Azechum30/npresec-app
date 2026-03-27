"use client";

import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/types";
import { Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

function TwoFactorComponent() {
  const [totp, setTotp] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const handleTotpVerification = () => {
    setError("");

    if (totp.length !== 6) {
      setError("Please provide a 6-digit code");
    }

    startTransition(async () => {
      await authClient.twoFactor.verifyTotp(
        {
          code: totp,
          trustDevice: true,
        },
        {
          async onSuccess() {
            const { data: sessionData } = await authClient.getSession();

            if (!sessionData?.user) {
              setError(
                "Session not found after verification. Please try again.",
              );
              return;
            }
            const userRoles = [
              "admin",
              "teaching_staff",
              "student",
              "parent",
              "staff",
            ];
            if (
              "roles" in sessionData.user &&
              Array.isArray(sessionData.user.roles)
            ) {
              const priorityRoles =
                sessionData.user?.roles
                  ?.flatMap((rs) => rs.role?.name as UserRole)
                  .filter(Boolean) || [];
              const priorityRole = priorityRoles.find((r) =>
                userRoles.includes(r),
              );

              setError("");
              setTotp("");
              toast.success("totp code verified");
              router.refresh();
              if (priorityRole === "admin") {
                router.push("/admin/dashboard");
              } else if (priorityRole === "teaching_staff") {
                router.push("/teachers");
              } else if (priorityRole === "student") {
                router.push("/students");
              }
            }
          },

          onError(ctx) {
            toast.error(ctx.error.message);
            setError(ctx.error.message);
          },
        },
      );
    });
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="text-lg font-bold">Verify OTP</CardTitle>
        <CardDescription>
          Kindly enter your time-based one-time-password into the input and
          verify your identity to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full flex-col flex  space-y-4 justify-center items-center">
        {error && <ErrorComponent error={error} />}
        <InputOTP
          maxLength={6}
          value={totp}
          onChange={(value) => setTotp(value)}>
          <InputOTPGroup>
            <InputOTPSlot
              index={0}
              className="size-10 font-semibold text-base"
            />
            <InputOTPSlot
              index={1}
              className="size-10 font-semibold text-base"
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={2}
              className="size-10 font-semibold text-base"
            />
            <InputOTPSlot
              index={3}
              className="size-10 font-semibold text-base"
            />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot
              index={4}
              className="size-10 font-semibold text-base"
            />
            <InputOTPSlot
              index={5}
              className="size-10 font-semibold text-base"
            />
          </InputOTPGroup>
        </InputOTP>
        <Button
          onClick={handleTotpVerification}
          size="icon-lg"
          className="w-full h-11 hover:cursor-pointer">
          {isPending ? (
            <>
              <Loader className="size-5 animate-spin mr-2" />
              Verifing code...
            </>
          ) : (
            <>Verify code</>
          )}
        </Button>
        <div className=" italic bg-card rounded-md p-1.75 text-xs">
          <Link
            href="/account-recovery"
            className="hover:underline text-primary">
            Use a different method
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default TwoFactorComponent;
