"use client";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { ErrorComponent } from "./ErrorComponent";
import LoadingButton from "./LoadingButton";

type ResendVerificationEmailButtonProps = {
  email: string;
};
export const ResendVerificationEmailButton = ({
  email,
}: ResendVerificationEmailButtonProps) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleVerificationEmailSending = () => {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const { error } = await authClient.sendVerificationEmail({
        email,
        callbackURL: "/email-verified",
      });

      if (error) {
        setError(error.message || "Could not send verification email!");
      } else {
        setSuccess(true);
      }
    });
  };
  return (
    <div className="space-y-4">
      {error && <ErrorComponent error={error} />}
      {success && (
        <div className="p-2 rounded-md border text-green-500">
          Verification email sent successfully!
        </div>
      )}
      <LoadingButton
        type="button"
        loading={isPending as boolean}
        onClick={handleVerificationEmailSending}>
        Resend Verification Email
      </LoadingButton>
    </div>
  );
};
