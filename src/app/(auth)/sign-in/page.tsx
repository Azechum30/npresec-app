import { getUserRole } from "@/lib/get-session";
import SignInForm from "@/components/customComponents/SignInForm";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getAuthRedirectPathWithLogging } from "@/utils/auth-redirects";
import { headers } from "next/headers";
import { Route } from "next";

export const metadata: Metadata = {
  title: "Authenticate",
  description: "Authenticate to access the system",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};
export default async function AuthenticatePage({ searchParams }: Props) {
  const userRole = await getUserRole();
  const { callbackUrl } = await searchParams;
  const referer = (await headers()).get("x-pathname");

  if (userRole) {
    const redirectPath = getAuthRedirectPathWithLogging({
      callbackUrl: callbackUrl,
      userRole: userRole,
      defaultFallback: "/profile",
      referrer: referer ?? undefined,
    });

    redirect(redirectPath as Route);
  }
  return <SignInForm />;
}
