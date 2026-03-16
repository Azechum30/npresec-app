import { inferAdditionalFields } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
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
