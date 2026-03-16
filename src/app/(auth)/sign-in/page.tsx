import SignInForm from "@/components/customComponents/SignInForm";
import { getAuthUser } from "@/lib/get-session"; // Use full session for multiple roles
import { getAuthRedirectPathWithLogging } from "@/utils/auth-redirects";
import { Metadata, Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Signin to access the system",
};

// export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ [key: string]: string | undefined }>;
};

export default function AuthenticatePage({ searchParams }: Props) {
  return (
    <Suspense>
      <RenderSignInPage searchParams={searchParams} />
    </Suspense>
  );
}

const RenderSignInPage = async ({ searchParams }: Props) => {
  const queryParams = await searchParams;
  const headerList = await headers();
  const referer = headerList.get("referer");

  const user = await getAuthUser();

  if (user) {
    const { callbackUrl } = queryParams;
    const userRoleNames = user.roles?.map((rs) => rs.role.name) ?? [];

    const priorityOrder = [
      "admin",
      "teaching_staff",
      "staff",
      "student",
      "parent",
    ];
    const primaryRole = priorityOrder.find((role) =>
      userRoleNames.includes(role)
    );

    const redirectPath = getAuthRedirectPathWithLogging({
      callbackUrl: callbackUrl,
      userRole: primaryRole,
      defaultFallback: "/profile",
      referrer: referer ?? undefined,
    });

    redirect(redirectPath as Route);
  }

  return <SignInForm />;
};
