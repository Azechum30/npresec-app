"use client";

import { ExtendedSession } from "@/lib/auth-client";
import { createContext, useContext } from "react";

export type AuthUser = ExtendedSession["user"] | null;

const SessionContext = createContext<AuthUser>(null);

export default function SessionProvider({
  children,
  value,
}: React.PropsWithChildren<{ value: AuthUser }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(SessionContext);
  if (context === undefined)
    throw new Error("useAuth must be used inside a SessionProvider!");
  return context;
};
