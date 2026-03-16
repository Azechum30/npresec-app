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
      {children}
    </SessionProvider>
  );
};

const LayoutFallback = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <Loader className="size-20 text-primary animate-spin" />
    </div>
  );
};
