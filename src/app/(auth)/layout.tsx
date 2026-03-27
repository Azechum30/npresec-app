import AuthLayoutCompoent from "@/components/customComponents/auth-layout-component";
import SessionProvider from "@/components/customComponents/SessionProvider";
import { ExtendedSession } from "@/lib/auth-client";
import { getAuthUser } from "@/lib/get-session";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { connection } from "next/server";
import React, { ReactNode } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <>
      <RenderAuthLayoutComponent siblings={children} />
    </>
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
