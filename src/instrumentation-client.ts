// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const isDev = process.env.NODE_ENV === "development";

// Completely disable Sentry in development to prevent source map parsing errors
if (!isDev) {
  Sentry.init({
    dsn: "https://0fb8a9b27f3f0ffcfa50c127b30fbd53@o4509157414666240.ingest.us.sentry.io/4509157416042496",

    // Add optional integrations for additional features
    integrations: [Sentry.replayIntegration()],

    // Define how likely traces are sampled
    tracesSampleRate: 1,

    // Define how likely Replay events are sampled
    replaysSessionSampleRate: 0.1,

    // Define how likely Replay events are sampled when an error occurs
    replaysOnErrorSampleRate: 1.0,

    // Setting this option to true will print useful information to the console
    debug: false,
  });
}

// Only export router transition start handler in production
export const onRouterTransitionStart = isDev
  ? () => {}
  : Sentry.captureRouterTransitionStart;
