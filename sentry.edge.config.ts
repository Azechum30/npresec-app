// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV === "development";

// Completely disable Sentry in development to prevent source map parsing errors
if (!isDev) {
  Sentry.init({
    dsn: "https://0fb8a9b27f3f0ffcfa50c127b30fbd53@o4509157414666240.ingest.us.sentry.io/4509157416042496",

    // Define how likely traces are sampled
    tracesSampleRate: 1,

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
