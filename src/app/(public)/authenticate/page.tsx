import SignInForm from "@/components/customComponents/SignInForm";
import SignUpForm from "@/components/customComponents/SignUpForm";
import TabSwitcher from "@/components/customComponents/TabSwitcher";

import { getAuthUser } from "@/lib/getAuthUser";
import { redirect } from "next/navigation";

export default async function AuthenticatePage() {
  const user = await getAuthUser();
  if (user) {
    if (user.role?.name === "teacher") {
      return redirect("/teachers");
    } else if (user.role?.name === "student") {
      return redirect("/students");
    } else {
      return redirect("/admin/dashboard");
    }
  }
  return (
    <TabSwitcher
      signin={<SignInForm />}
      signup={<SignUpForm />}
      className="w-full max-w-md mx-auto"
    />
  );
}
