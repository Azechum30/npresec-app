import { checkAuthAction } from "@/app/actions/auth-actions";
import SignInForm from "@/components/customComponents/SignInForm";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Authenticate",
  description: "Authenticate to access the system",
};

export default async function AuthenticatePage() {
  const { user } = await checkAuthAction();

  if (user) {
    const pathname =
      user.role?.name === "admin"
        ? "/admin/dashboard"
        : user.role?.name === "teaching_staff"
          ? "/teachers"
          : user.role?.name === "student"
            ? "/students"
            : "/";

    redirect(pathname);
  }
  return <SignInForm />;
}
