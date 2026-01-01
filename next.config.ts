import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  turbopack: {
    rules: {
      "*.ts": {
        loaders: [],
      },
      "*.tsx": {
        loaders: [],
      },
    },
  },
  // Disable source maps in development to prevent Sentry parsing errors
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config, { dev, isServer }) => {
      if (dev) {
        config.devtool = false;
      }

      if (!isServer) {
        // Exclude Node.js modules from client-side bundle
        config.externals = [
          ...(config.externals || []),
          "require-in-the-middle",
        ];
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
  }),
  typedRoutes: true,
  // cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
    authInterrupts: true,
    // Disable turbopack source maps in development
    ...(process.env.NODE_ENV === "development" && {}),
  },
  serverExternalPackages: ["require-in-the-middle"],
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  ...(process.env.NODE_ENV === "production" && { turbopack: {} }),

  images: {
    qualities: [70, 75, 80, 85, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },

  // Production webpack configuration
  ...(process.env.NODE_ENV === "production" && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        // Exclude Node.js modules from client-side bundle
        config.externals = [
          ...(config.externals || []),
          "require-in-the-middle",
        ];
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
  }),
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "pe-it-solutions",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Disable Sentry webpack plugin in development to prevent source map issues
  ...(process.env.NODE_ENV === "development" && {
    dryRun: true,
    hideSourceMaps: true,
  }),

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  ...(process.env.NODE_ENV === "production" && {
    widenClientFileUpload: true,
  }),

  tunnelRoute: "/monitoring",

  disableLogger: process.env.NODE_ENV === "production",
  automaticVercelMonitors: process.env.NODE_ENV === "production",
});
