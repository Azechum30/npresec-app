import MainContainer from "@/components/customComponents/MainContainer";
import SessionProvider from "@/components/customComponents/SessionProvider";
import Sidebar from "@/components/customComponents/Sidebar";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";
import { ExtendedSession } from "@/lib/auth-client";
import { getAuthUser } from "@/lib/get-session";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { ReactNode, Suspense } from "react";
import { RegisterClientSideBackgroundNotifications } from "./(admin)/admin/users/_hooks/register-client-side-background-notifications";

export default function PrivateRoutesLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <TanstackQueryProvider>
      <main className="w-full flex transition-all duration-300 ease">
        <Suspense fallback={<LayoutFallback />}>
          <RenderSessionProvider>
            <Sidebar />
            <MainContainer>{children}</MainContainer>
          </RenderSessionProvider>
        </Suspense>
      </main>
    </TanstackQueryProvider>
  );
}

const RenderSessionProvider = async ({ children }: { children: ReactNode }) => {
  await connection();

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }
  return (
    <SessionProvider value={user as ExtendedSession["user"]}>
      <>
        {children}
        <Suspense>
          <RegisterClientSideBackgroundNotifications
            userId={user.id}
            eventNames={[
              "Error-sending-staff-emails",
              "bulk-rate-limit-exceeded",
              "staff-progress",
              "staff-emails-partial-complete",
              "staff-bulk-creation-success",
              "staff-onboarding-progress",
              "staff-emails-sent-completed",
              "staff-emails-sending-progress",
              "staff-onboarding-email-sent",
              "staff-onboarding-success",
              "workflow-failed",
              "single-student-email-success",
              "single-student-email-error",
              "single-student-onboard-success",
              "single-student-workflow-failed",
              "student-bulk-creation-success",
              "bulk-student-workflow-failed",
              "students-emails-sent-completed",
            ]}
          />
        </Suspense>
      </>
    </SessionProvider>
  );
};

const LayoutFallback = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader className="size-16 text-primary animate-spin" />
      <span className="font-mono text-base bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent animate-pulse">
        Loading Data...
      </span>
    </div>
  );
};
