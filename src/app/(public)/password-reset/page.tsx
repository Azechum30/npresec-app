import ResetPasswordForm from "@/components/customComponents/ResetPasswordForm";

export const dynamic = "force-dynamic";
export default function PasswordResetPage() {
  return (
    <div className="w-full max-w-md mx-auto">
      <ResetPasswordForm />
    </div>
  );
}
