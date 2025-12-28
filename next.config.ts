import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  typedRoutes: true,
  // cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    authInterrupts: true,
  },
  serverExternalPackages: ["require-in-the-middle"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  turbopack: {},

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Exclude Node.js-only packages from Edge runtime bundling
  // Note: This applies to webpack builds. For Turbopack, ensure imports are runtime-guarded
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Node.js modules from client-side bundle
      config.externals = [...(config.externals || []), "require-in-the-middle"];
      config.resolve.fallback = {
        ...config.resolve.fallback,
        dns: false,
        net: false,
        tls: false,
        fs: false,
        pg: false,
        "require-in-the-middle": false,
      };
    }
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "pe-it-solutions",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
