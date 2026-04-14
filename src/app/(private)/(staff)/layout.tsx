import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { hasRole } from "@/lib/get-session";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import React, { ReactNode, Suspense } from "react";

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <StaffAuthGuard>{children}</StaffAuthGuard>
    </Suspense>
  );
}

const StaffAuthGuard = async ({ children }: { children: ReactNode }) => {
  await connection();
  const userRole = await hasRole("teaching_staff");

  if (!userRole) {
    redirect("/403");
  }
  return <>{children}</>;
};
