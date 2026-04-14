"use client";

import { RegisterClientSideBackgroundNotifications } from "@/app/(private)/(admin)/admin/users/_hooks/register-client-side-background-notifications";
import { useSearchParams } from "next/navigation";

export const RenderNotification = () => {
  const searchParams = useSearchParams();

  const admissionId = searchParams.get("admissionId") ?? "";

  return (
    <RegisterClientSideBackgroundNotifications
      userId={admissionId}
      eventNames={[
        "online-admission-onboarding-failed",
        "online-admission-onboarding-complete",
        "single-student-email-success",
        "single-student-email-error",
      ]}
    />
  );
};
