import { getAuthUser } from "@/lib/getAuthUser";
import React from "react";
import { redirect } from "next/navigation";

export default async function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    // This shouldn't happen since private layout handles auth, but safety check
    redirect("/sign-in");
  }

  if (user.role?.name !== "teacher") {
    // Redirect to 403 page instead of potentially causing loops
    redirect("/403");
  }

  return <>{children}</>;
}
