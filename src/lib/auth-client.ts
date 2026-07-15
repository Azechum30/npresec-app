import {
  adminClient,
  inferAdditionalFields,
  twoFactorClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { ac, admin, teaching_staff } from "./permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: { admin, teaching_staff },
    }),
    twoFactorClient(),
  ],
});

export type ExtendedSession = typeof authClient.$Infer.Session & {
  user: {
    roles?:
      | {
          id: string;
          role?: {
            id: string;
            name: string;
            permissions?:
              | {
                  id: string;
                  name: string;
                }[]
              | null;
          };
        }[]
      | null;
  };
};

export const { useSession, signIn, signOut, signUp, resetPassword } =
  authClient;
