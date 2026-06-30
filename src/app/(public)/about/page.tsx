/** biome-ignore-all assist/source/organizeImports: reason */
import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import { AboutPageContent } from "./_components/about-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Presbyterian Senior High Technical School (NPRESEC) in Nakpanduri, Ghana. Discover our history, mission, vision, values, and commitment to providing quality education since our establishment.",

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

  authors: [{ name: "Presbyterian Senior High Technical School (NPRESEC)" }],
  creator: "NPRESEC MIS",

  openGraph: {
    title: "About Us - Presbyterian Senior High Technical School (NPRESEC)",
    description:
      "Discover the story, mission, and values of NPRESEC - a leading senior high school in Nakpanduri, North East Region of Ghana.",
    url: `${env.NEXT_PUBLIC_URL}/about`, // Update with your actual URL
    siteName: "NPRESEC",
    images: [
      {
        url: "/opengraph-image",
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
    title: "About Us - NPRESEC",
    description:
      "Learn about our rich history, mission, and dedication to excellence at Presbyterian Senior High Technical School.",
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
