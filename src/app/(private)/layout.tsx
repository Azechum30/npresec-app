/** biome-ignore-all assist/source/organizeImports: reason */

import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { ExportColumnConfigProvider } from "@/components/customComponents/export-column-config-provider";
import MainContainer from "@/components/customComponents/MainContainer";
import SessionProvider from "@/components/customComponents/SessionProvider";
import { SetSystemWideActions } from "@/components/customComponents/set-system-wide-actions";
import SettingsProvider from "@/components/customComponents/settings-provider";
import Sidebar from "@/components/customComponents/Sidebar";
import TanstackQueryProvider from "@/components/providers/tanstack-query-provider";
import type { ExtendedSession } from "@/lib/auth-client";
import { EVENTS } from "@/lib/constants";
import { getAuthUser } from "@/lib/get-session";
import { env } from "@/lib/server-only-actions/validate-env";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { type ReactNode, Suspense } from "react";
import { getSystemSettings } from "../actions/get-system-settings";
import { RegisterClientSideBackgroundNotifications } from "./(admin)/admin/users/_hooks/register-client-side-background-notifications";

export default function PrivateRoutesLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <main className="w-full flex transition-all duration-300 ease">
      <Suspense fallback={<LayoutFallback />}>
        <RenderSessionProvider>
          <TanstackQueryProvider>
            <Sidebar />
            <SetSystemWideActions />
            <MainContainer>{children}</MainContainer>
            <ExportColumnConfigProvider />
          </TanstackQueryProvider>
        </RenderSessionProvider>
      </Suspense>
    </main>
  );
}

const RenderSessionProvider = async ({ children }: { children: ReactNode }) => {
  await connection();

  const user = await getAuthUser();
  const { settings } = await getSystemSettings();

  if (!user) {
    return redirect("/sign-in");
  }

  const WEB_SOCKET_EVENTS = EVENTS;
  return (
    <SessionProvider value={user as ExtendedSession["user"]}>
      {children}
      <Suspense>
        <RegisterClientSideBackgroundNotifications
          userId={user.id}
          eventNames={WEB_SOCKET_EVENTS}
        />
        <SettingsProvider
          cluster={env.NEXT_PUBLIC_PUSHER_CLUSTER}
          pusherKey={env.NEXT_PUBLIC_PUSHER_APP_KEY}
          initial={settings}
        />
      </Suspense>
    </SessionProvider>
  );
};

const LayoutFallback = () => <DotMatrixLoader />;
