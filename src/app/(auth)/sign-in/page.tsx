import SignInForm from "@/components/customComponents/SignInForm";

import { getAuthUser } from "@/lib/getAuthUser";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Authenticate",
  description: "Authenticate to access the system",
};

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
  return <SignInForm />;
}
