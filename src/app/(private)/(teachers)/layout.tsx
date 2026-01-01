import React, { ReactNode, Suspense } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/get-session";
import { forbidden } from "next/navigation";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

export default function TeachersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <StaffAuthGuard>{children}</StaffAuthGuard>;
    </Suspense>
  );
}

const StaffAuthGuard = async ({ children }: { children: ReactNode }) => {
  const user = await getAuthUser();
  if (!user) {
    redirect("/sign-in");
  }
  if (user.role?.name !== "teaching_staff") forbidden();
  return <>{children}</>;
};
