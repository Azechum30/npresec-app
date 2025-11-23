import { getAuthUser } from "@/lib/getAuthUser";
import React from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    return redirect("/sign-in");
  }

  if (user?.role?.name !== "teacher") {
    const referer = (await headers()).get("referrer") || "/";
    return redirect(referer);
  }

  return <>{children}</>;
}
