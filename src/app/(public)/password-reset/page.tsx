import ResetPasswordForm from "@/components/customComponents/ResetPasswordForm";
import { Suspense } from "react";

export default function PasswordResetPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
