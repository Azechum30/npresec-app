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

  output: process.env.VERCEL === undefined ? "standalone" : undefined,
  ...(process.env.NODE_ENV === "development" && {
    webpack: (config, { dev, isServer }) => {
      if (dev) {
        config.devtool = false;
      }

      if (!isServer) {
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
  cacheComponents: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },

    authInterrupts: true,
    ...(process.env.NODE_ENV === "development" && {}),
  },
  serverExternalPackages: ["require-in-the-middle", "@prisma/client", "pg"],
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

  ...(process.env.NODE_ENV === "production" && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
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
  org: "pe-it-solutions",
  project: "javascript-nextjs",
  silent: !process.env.CI,

  ...(process.env.NODE_ENV === "development" && {
    dryRun: true,
    hideSourceMaps: true,
  }),

  ...(process.env.NODE_ENV === "production" && {
    widenClientFileUpload: true,
  }),

  tunnelRoute: "/monitoring",

  webpack: {
    treeshake: {
      removeDebugLogging: process.env.NODE_ENV === "production",
    },
    automaticVercelMonitors: process.env.NODE_ENV === "production",
  },
});
