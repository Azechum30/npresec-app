import { sendEmail } from "@/utils/send-email";
import { betterAuth, BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { customSession, twoFactor } from "better-auth/plugins";
import { prisma } from "./prisma";

const authOptions = {
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  experimental: { joins: true },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      void sendEmail({ to: user.email, url, type: "verification" });
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      void sendEmail({
        to: user.email,
        url: url,
        subject: "Reset your password",
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 8, // 8 hours
    updateAge: 60 * 60, // 1 hour
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes,
      strategy: "compact",
    },
    freshAge: 60 * 5,
  },

  user: {
    deleteUser: {
      enabled: true,
    },

    additionalFields: {
      // Core identity fields
      username: {
        type: "string",
        required: true,
        unique: true,
      },
      name: {
        type: "string",
        required: false,
      },
      image: {
        type: "string",
        required: false,
      },

      // Profile fields
      bio: {
        type: "string",
        required: false,
      },
      linkedInUrl: {
        type: "string",
        required: false,
      },
      xUrl: {
        type: "string",
        required: false,
      },
      facebookUrl: {
        type: "string",
        required: false,
      },
      instagramUrl: {
        type: "string",
        required: false,
      },

      // Preferences
      theme: {
        type: "string",
        required: false,
        defaultValue: "system",
      },
      compactMode: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      showTips: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      subscribeToOurNewsLetter: {
        type: "boolean",
        required: false,
        defaultValue: false,
      },
      timezone: {
        type: "string",
        required: false,
        defaultValue: "Africa/Accra",
      },
      dateFormat: {
        type: "string",
        required: false,
        defaultValue: "DD/MM/YYYY",
      },
      itemsPerPage: {
        type: "number",
        required: false,
        defaultValue: 10,
      },
      notificationFrequency: {
        type: "string",
        required: false,
        defaultValue: "realtime",
      },

      // JSON fields
      socials: {
        type: "json",
        required: false,
      },
      emailNotifications: {
        type: "json",
        required: false,
      },
    },
  },
} satisfies BetterAuthOptions;

export const auth = betterAuth({
  ...authOptions,
  appName: "npresec-app",
  plugins: [
    twoFactor({}),
    customSession(async ({ user, session }) => {
      const userWithRole = await prisma.user.findUnique({
        where: { id: session.userId },
        select: {
          roles: {
            select: {
              id: true,
              role: {
                select: {
                  id: true,
                  name: true,
                  permissions: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        session,
        user: {
          ...user,
          ...userWithRole,
        },
      } as const;
    }),

    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
