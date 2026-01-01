import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV === "development";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Only import Sentry config in production to prevent source map parsing errors
    if (!isDev) {
      await import("../sentry.server.config");
    }
    // Only import orpc.server in Node.js runtime (not Edge)
    // This prevents pg/dns module errors in Edge runtime
    await import("./lib/orpc.server");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    // Only import Sentry config in production to prevent source map parsing errors
    if (!isDev) {
      await import("../sentry.edge.config");
    }
  }
}

// Only export Sentry error handler in production
export const onRequestError = isDev ? () => {} : Sentry.captureRequestError;
