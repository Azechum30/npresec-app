"use client";

import { createContext, useContext } from "react";
import { getAuthUser } from "@/lib/getAuthUser";

// Type for the user with role information from getAuthUser
export type AuthUser = Awaited<ReturnType<typeof getAuthUser>>;

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
