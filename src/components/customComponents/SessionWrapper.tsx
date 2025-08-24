"use client";

import SessionProvider from "./SessionProvider";
import { AuthUser } from "./SessionProvider";

export const SessionWrapper = ({
  children,
  user,
}: {
  children: React.ReactNode;
  user: AuthUser;
}) => {
  return <SessionProvider value={user}>{children}</SessionProvider>;
};
