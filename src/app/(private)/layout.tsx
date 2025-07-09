import { ReactNode } from "react";
import Sidebar from "@/components/customComponents/Sidebar";
import MainContainer from "@/components/customComponents/MainContainer";
import SessionProvider from "@/components/customComponents/SessionProvider";
import { getSession } from "@/lib/get-user";
import { redirect } from "next/navigation";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";
import { getAuthUser } from "@/lib/getAuthUser";


export default async function PrivateRoutesLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const [sessionData, userData] = await Promise.all([
    getSession(),
    getAuthUser(),
  ]);

  if (!sessionData.user || !sessionData.user) {
    return redirect("/sign-in");
  }

  return (
    <SessionProvider value={userData}>
      <TanstackQueryProvider>
        <main className="w-full flex transition-all duration-300 ease">
          <Sidebar />
          <MainContainer>{children}</MainContainer>
        </main>
      </TanstackQueryProvider>
    </SessionProvider>
  );
}
