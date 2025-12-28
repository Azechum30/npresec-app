import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/utils/send-email";

export const auth = betterAuth({
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
    sendResetPassword: async ({ user, url }, request) => {
      void sendEmail({
        to: user.email,
        url: url,
        subject: "Reset your password",
      });
    },
  },
  session: {
    expiresIn: 60 * 60 * 24, // 1 day
    updateAge: 60 * 60 * 7, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes,
      strategy: "compact",
    },
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

      roleId: {
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
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
