import "server-only";

import arcjet, {
  type BotOptions,
  detectBot,
  type EmailOptions,
  fixedWindow,
  FixedWindowRateLimitOptions,
  request,
  shield,
  slidingWindow,
  validateEmail,
} from "@arcjet/next";
import { headers } from "next/headers";
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
  deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
} satisfies EmailOptions;

export const botOptions = {
  mode: "LIVE",
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

export const ajPublic = arcjet({
  key: env.ARCJET_KEY,
  characteristics: ["src.ip"],
  rules: [
    shield({
      mode: "LIVE",
    }),
  ],
});

export const pubArcjectRateLimit = async (): Promise<{
  error?: string;
  success?: boolean;
}> => {
  const rqh = await headers();
  const req = await request();

  const xf = rqh.get("x-forwarded-for") ?? "127.0.0.1";
  const ipAddress = xf.split(",")[0];

  const arc = ajPublic.withRule(fixedWindow(rateLimitOptions));

  const decisions = await arc.protect(req, {
    "src.ip": ipAddress,
  });

  if (decisions.isDenied() && decisions.reason.isRateLimit()) {
    return { error: "Too many request. Please try again later!" };
  }

  return { success: true };
};

export const pubBotProtection = async () => {
  const rqh = await headers();
  const req = await request();

  const xf = rqh.get("x-forwarded-for") ?? "127.0.0.1";
  const ip = xf.split(",")[0];

  const arc = ajPublic.withRule(detectBot(botOptions));
  const decisions = await arc.protect(req, { "src.ip": ip });

  if (decisions.isDenied()) {
    console.log(decisions);
    if (decisions.reason.isBot()) {
      return { error: "Bots are not allowed here." };
    }
  }

  return { success: true };
};
