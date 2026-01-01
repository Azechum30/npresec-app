import { FallbackComponent } from "@/components/customComponents/fallback-component";
import MainContainer from "@/components/customComponents/MainContainer";
import SessionProvider from "@/components/customComponents/SessionProvider";
import Sidebar from "@/components/customComponents/Sidebar";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";
import { ExtendedSession } from "@/lib/auth-client";
import { getAuthUser } from "@/lib/get-session";
import { ReactNode, Suspense } from "react";

export default async function PrivateRoutesLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    return "No Users";
  }
  return (
    <SessionProvider value={user as ExtendedSession["user"]}>
      <TanstackQueryProvider>
        <main className="w-full flex transition-all duration-300 ease">
          <Suspense fallback={<FallbackComponent />}>
            <Sidebar />
            <MainContainer>{children}</MainContainer>
          </Suspense>
        </main>
      </TanstackQueryProvider>
    </SessionProvider>
  );
}
