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
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/types";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
export const RecoveryComponent = () => {
  const [codes, setCodes] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [isResetPending, startResetTransition] = useTransition();

  const handleCodesVerification = () => {
    setError("");

    startTransition(async () => {
      console.log("Backup codes: ", codes);
      const { data, error } = await authClient.twoFactor.verifyBackupCode({
        code: codes.trim(),
        disableSession: false,
      });

      if (error) {
        setError(error.message!);
        setSuccess(false);
        return;
      }

      if (data) {
        toast.success("codes verified!");
        setSuccess(true);
        setError("");
      }
    });
  };

  const handleAccountReset = () => {
    if (!password) {
      setError("Passwor is required");
      return;
    }

    startResetTransition(async () => {
      const { data, error } = await authClient.twoFactor.disable({
        password: password.trim(),
      });

      if (error) {
        setError(error.message!);
        return;
      }

      if (data) {
        toast.success(
          "Account reset successful. You shall be required to enable 2FA on subsequent logins",
        );

        const userRoles = [
          "admin",
          "student",
          "teaching_staff",
          "parent",
          "staff",
        ];

        const { data: sessionData } = await authClient.getSession();

        if (!sessionData?.user) {
          setError("No session was found. Please try again!");
          return;
        }
        if (
          "roles" in sessionData.user &&
          Array.isArray(sessionData.user.roles)
        ) {
          const roles =
            sessionData.user.roles.flatMap((r) => r.role.name as UserRole) ||
            [];
          const role = roles.find((role) => userRoles.includes(role));

          if (role === "admin") {
            router.push("/admin/dashboard");
          } else if (role === "teaching_staff") {
            router.push("/staff/dashboard");
          } else if (role === "student") {
            router.push("/students");
          }
        }
      }
    });
  };
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>{success ? "Reset Account" : "Account Recovery"}</CardTitle>
        <CardDescription>
          {success
            ? "You are required to reset your account to enable you use time-based one-time-password to verify your identity instead of backup codes"
            : "To successfully recover your account, you are required to provide one of the unused backup codes that were initially shown to you when you first enabled 2FA. Remember that a code can only be used once."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {error && <ErrorComponent error={error} />}
        {success ? (
          <>
            <Input
              type="password"
              placeholder="Enter your password to reset your account"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              className="hover:cursor-pointer"
              onClick={handleAccountReset}>
              {isResetPending ? (
                <>
                  <Loader className="size-5 animate-spin mr-2" />
                  Resetting account...
                </>
              ) : (
                <>Reset Account</>
              )}
            </Button>
          </>
        ) : (
          <>
            <Input
              value={codes}
              onChange={(e) => setCodes(e.target.value)}
              placeholder="Enter 10-character backup code here"
              className="h-12"
            />

            <Button
              disabled={isPending}
              onClick={handleCodesVerification}
              className="h-12 w-full hover:cursor-pointer">
              {isPending ? (
                <>
                  <Loader className="size-5 animate-spin mr-2" />
                  Recovering account...
                </>
              ) : (
                <>Recover Account</>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
