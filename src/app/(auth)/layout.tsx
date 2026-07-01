/** biome-ignore-all assist/source/organizeImports: reason */

import AuthLayoutCompoent from "@/components/customComponents/auth-layout-component";
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import SessionProvider from "@/components/customComponents/SessionProvider";
import type { ExtendedSession } from "@/lib/auth-client";
import { getAuthUser } from "@/lib/get-session";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense, type ReactNode } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

type AuthLayoutProps = {
  children: ReactNode;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Suspense fallback={<DotMatrixLoader />}>
      <RenderAuthLayoutComponent siblings={children} />
    </Suspense>
  );
}

const RenderAuthLayoutComponent = async ({
  siblings,
}: {
  siblings: ReactNode;
}) => {
  await connection();
  const user = (await getAuthUser()) as ExtendedSession["user"];

  return (
    <SessionProvider value={user ?? null}>
      <AuthLayoutCompoent siblings={siblings} />
    </SessionProvider>
  );
};
