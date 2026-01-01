// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
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

    // Disable console breadcrumbs to prevent Date.now() errors in server components
    beforeBreadcrumb: (breadcrumb) => {
      // Filter out console breadcrumbs to prevent Date.now() timing issues
      if (breadcrumb.category === "console") {
        return null;
      }
      return breadcrumb;
    },
  });
}
