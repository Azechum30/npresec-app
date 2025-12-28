import { ReactNode, Suspense } from "react";
import Sidebar from "@/components/customComponents/Sidebar";
import MainContainer from "@/components/customComponents/MainContainer";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { checkAuthAction } from "../actions/auth-actions";
import SessionProvider from "@/components/customComponents/SessionProvider";

export default async function PrivateRoutesLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { user } = await checkAuthAction();

  if (!user) {
    return "No Users";
  }
  return (
    <SessionProvider value={user}>
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
