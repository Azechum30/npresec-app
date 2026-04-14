"use client";

import { useAuth } from "@/components/customComponents/SessionProvider";
import { Button } from "@/components/ui/button";
import { InputGroup } from "@/components/ui/input-group";
import {
  InputOTP,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/lib/types";
import { CheckCircle2, Copy, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import QRCode from "react-qr-code";
import { toast } from "sonner";

function VerifyTotp({
  totpUrl,
  backupCodes,
}: {
  totpUrl: string;
  backupCodes: string[];
}) {
  const [totp, setTotp] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState("");

  const user = useAuth();
  if (!user) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(backupCodes.join("\n"));
      toast.success("Backup codes copied to clipboard");
    } catch (e) {
      console.error("Failed to copy backup codes");
      toast.error("Failed to copy backup codes");
    }
  };

  const handleTotpVerification = () => {
    setError("");
    if (totp.length !== 6) return toast.error("Please enter a 6-digit code!");

    startTransition(async () => {
      await authClient.twoFactor.verifyTotp(
        {
          code: totp,
        },
        {
          async onSuccess() {
            setError("");
            const { data: sessionData } = await authClient.getSession();
            const userRoles = [
              "admin",
              "teaching_staff",
              "student",
              "staff",
              "parent",
            ];

            if (!sessionData?.user) {
              setError("No session was found. Please try again!");
              return;
            }

            if (
              "roles" in sessionData.user &&
              Array.isArray(sessionData.user.roles)
            ) {
              const roles =
                sessionData.user.roles
                  .flatMap((rs) => rs.role.name as UserRole)
                  .filter(Boolean) || [];
              const priorityRole = roles.find((r) => userRoles.includes(r));

              toast.success("2FA has been successfully enabled");
              setTotp("");

              if (priorityRole === "admin") {
                router.push("/admin/dashboard");
              } else if (priorityRole === "teaching_staff") {
                router.push("/staff/dashboard");
              } else if (priorityRole === "student") {
                router.push("/students");
              }
            }
          },

          onError(context) {
            toast.error(context.error.message);
            setError(context.error.message);
          },
        },
      );
    });
  };

  return (
    <div className="flex flex-col space-y-3 items-center">
      {!user.twoFactorEnabled && (
        <>
          <QRCode
            value={totpUrl}
            size={200}
            className="bg-white p-4 rounded-lg shadow-sm"
          />
          <div className="w-full border rounded-lg p-4 bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-bold text-sm flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-500" /> Save Backup
                Codes
              </h5>
              {/* Added Copy Button */}
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs gap-1"
                onClick={copyToClipboard}>
                <Copy className="size-3" />
                Copy
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {backupCodes.map((code) => (
                <code
                  key={code}
                  className="text-xs bg-background p-1.5 rounded border text-center font-mono">
                  {code}
                </code>
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Keep these codes in a password manager. You will need them if you
              lose access to your authenticator app.
            </p>
          </div>
        </>
      )}

      <div className="space-y-4">
        <Label className="font-bold text-sm">Enter code here:</Label>
        <InputOTP
          maxLength={6}
          className="w-full"
          value={totp}
          onChange={(value) => setTotp(value)}>
          <InputGroup className="w-full">
            <InputOTPSlot index={0} className="p-4" />
            <InputOTPSlot index={1} className="p-4" />
          </InputGroup>
          <InputOTPSeparator />
          <InputGroup>
            <InputOTPSlot index={2} className="p-4" />
            <InputOTPSlot index={3} className="p-4" />
          </InputGroup>
          <InputOTPSeparator />
          <InputGroup>
            <InputOTPSlot index={4} className="p-4" />
            <InputOTPSlot index={5} className="p-4" />
          </InputGroup>
        </InputOTP>

        <Button
          disabled={isPending}
          onClick={handleTotpVerification}
          className="w-full hover:cursor-pointer h-11">
          {isPending ? (
            <>
              <Loader className="size-5 animate-spin mr-2" />
              Verifying TOTP...
            </>
          ) : (
            <>Verify Code</>
          )}
        </Button>
      </div>
    </div>
  );
}

export default VerifyTotp;
