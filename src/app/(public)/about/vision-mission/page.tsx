/** biome-ignore-all assist/source/organizeImports: reason */
import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import { VisionMissionContent } from "./vision-content";

export const metadata: Metadata = {
  title: "Vision, Mission & Core Values",
  description:
    "Discover the Vision, Mission, and Core Values that guide Presbyterian Senior High Technical School (NPRESEC) in Nakpanduri. Learn about our commitment to academic excellence, character development, and holistic education.",

  keywords: [
    "NPRESEC Vision",
    "NPRESEC Mission",
    "Core Values",
    "Presbyterian Senior High Technical School",
    "School Vision and Mission",
    "Educational Philosophy Ghana",
    "Nakpanduri SHS",
    "School Values",
  ],

  authors: [{ name: "Presbyterian Senior High Technical School (NPRESEC)" }],
  creator: "NPRESEC",

  openGraph: {
    title: "Vision, Mission & Core Values - NPRESEC",
    description:
      "Explore the guiding principles, vision, and mission that shape education at Presbyterian Senior High Technical School in Nakpanduri.",
    url: `${env.NEXT_PUBLIC_URL}/about/vision-mission`,
    siteName: "NPRESEC MIS",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Vision, Mission & Core Values - NPRESEC",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Vision, Mission & Core Values - NPRESEC",
    description:
      "Learn about the foundational principles guiding Presbyterian Senior High Technical School.",
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: `${env.NEXT_PUBLIC_URL}/about/vision-mission`, // Update with your actual URL
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function VisionMissonPage() {
  return <VisionMissionContent />;
}
