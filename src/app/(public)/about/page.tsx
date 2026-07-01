/** biome-ignore-all assist/source/organizeImports: reason */
import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import { AboutPageContent } from "./_components/about-content";

const ogTitle = "About Us | Nakpanduri Presby SHTS";
const ogDescription =
  "Discover the story, mission, and values of NPRESEC - a leading senior high school in Nakpanduri, North East Region of Ghana.";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Presbyterian SHTS in Nakpanduri, Ghana. Discover our history, mission, vision, values, and commitments.",

  keywords: [
    "About NPRESEC",
    "Presbyterian Senior High Technical School",
    "NPRESEC History",
    "School Mission Vision",
    "Nakpanduri School",
    "Senior High School Ghana",
    "North East Region Education",
    "Presbyterian Schools Ghana",
  ],

  metadataBase: new URL(env.NEXT_PUBLIC_URL),

  authors: [{ name: "Presbyterian Senior High Technical School (NPRESEC)" }],
  creator: "NPRESEC",

  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: `${env.NEXT_PUBLIC_URL}/about`, // Update with your actual URL
    siteName: "NPRESEC MIS",
    images: [
      {
        url: `/api/og?title=${ogTitle}&description=${ogDescription}`,
        width: 1200,
        height: 630,
        alt: "About NPRESEC - Presbyterian Senior High Technical School",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: [`/api/og?title=${ogTitle}&description=${ogDescription}`],
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
    canonical: `${env.NEXT_PUBLIC_URL}/about`, // Update with your actual URL
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
