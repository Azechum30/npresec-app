/** biome-ignore-all assist/source/organizeImports: reason */

import { env } from "@/lib/server-only-actions/validate-env";
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about/", "/admissions/"],
        disallow: [
          "/admin/",
          "/staff/",
          "/sign-in/",
          "/profile/",
          "/online-admissions/",
          "/attendance/",
          "/api/",
          "/rpc/",
          "/verify-results/",
          "/verify-student-transcript/",
          "/account-recovery/",
          "/email-verified/",
          "/forgot-password/",
          "/reset-password/",
          "/reset-password-notice/",
          "/setup-2fa/",
          "/verify-2fa/",
          "/online-payments/",
          "/403",
        ],
      },
    ],
    sitemap: `${env.NEXT_PUBLIC_URL}/sitemap.xml`,
  };
}
