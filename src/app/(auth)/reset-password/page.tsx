import ResetPasswordForm from "@/components/customComponents/ResetPasswordForm";
import { Suspense } from "react";

export const metadata = {
  title: "Password Reset",
  description: "Reset your password",
  keywords: "password, reset, recovery",
};

export default function PasswordResetPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
