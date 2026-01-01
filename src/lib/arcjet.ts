import "server-only";

import arcjet, {
  type ArcjetDecision,
  type BotOptions,
  type EmailOptions,
  type ProtectSignupOptions,
  type SlidingWindowRateLimitOptions,
  detectBot,
  protectSignup,
  shield,
  slidingWindow,
} from "@arcjet/next";
import ip from "@arcjet/ip";
import { env } from "./server-only-actions/validate-env";

export const aj = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["userId"],
  rules: [
    shield({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
    }),
  ],
});

const emailOptions = {
  mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

const botOptions = {
  mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
  allow: ["CATEGORY:SEARCH_ENGINE", "UPTIME_MONITOR"],
} satisfies BotOptions;

const rateLimitOptions = {
  mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
  interval: 60,
  max: 100,
} satisfies SlidingWindowRateLimitOptions<[]>;

const signupOptions = {
  email: emailOptions,
  bots: botOptions,
  rateLimit: rateLimitOptions,
} satisfies ProtectSignupOptions<[]>;
