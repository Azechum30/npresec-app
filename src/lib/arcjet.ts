import "server-only";

import arcjet, {
  type BotOptions,
  type EmailOptions,
  fixedWindow,
  FixedWindowRateLimitOptions,
  request,
  shield,
  slidingWindow,
  validateEmail,
} from "@arcjet/next";
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

export const emailOptions = {
  mode: "LIVE",
  block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

export const botOptions = {
  mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
  allow: ["CATEGORY:SEARCH_ENGINE", "UPTIME_MONITOR"],
} satisfies BotOptions;

export const rateLimitOptions = {
  mode: "LIVE",
  max: 5,
  window: 10,
} satisfies FixedWindowRateLimitOptions<[]>;

export const arcjetEmailProtection = async (
  email: string,
  userId: string,
): Promise<{ success?: boolean; error?: string }> => {
  const arj = aj.withRule(validateEmail(emailOptions));

  const req = await request();

  const decisions = await arj.protect(req, {
    email,
    userId,
  });

  if (decisions.isDenied()) {
    return { error: "The provided email is not valid" };
  }

  return { success: true };
};

export const arcjetRatelimit = async (
  userId: string,
): Promise<{ success?: boolean; error?: string }> => {
  const ajet = aj.withRule(fixedWindow(rateLimitOptions));
  const req = await request();

  const decisions = await ajet.protect(req, {
    userId,
  });

  if (decisions.isDenied()) {
    if (decisions.reason.isRateLimit()) {
      return { error: "Too many requests. Please try again later!" };
    }
  }

  return { success: true };
};

export const bulkRequestRateLimit = async (userId: string) => {
  const ajet = aj.withRule(
    slidingWindow({
      mode: "LIVE",
      interval: 10,
      max: 30,
    }),
  );

  const req = await request();
  const decisions = await ajet.protect(req, {
    userId,
  });

  if (decisions.isDenied()) {
    if (decisions.reason.isRateLimit()) {
      return { error: "Too many upload requests. Please try again later" };
    }
  }

  return { success: true };
};
