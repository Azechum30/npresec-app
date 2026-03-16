import { hasRole } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ReactNode } from "react";

export async function AdminAuthGuard({ children }: { children: ReactNode }) {
  await connection();

  const userHasRole = await hasRole("admin");

  if (!userHasRole) {
    redirect("/403");
  }

  return <>{children}</>;
}
