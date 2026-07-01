/** biome-ignore-all assist/source/organizeImports: reason */

import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import { Features } from "./_components/Features";
import { Hero } from "./_components/Hero";
import { Statistics } from "./_components/Statistics";
import { Welcome } from "./_components/Welcome";

const ogTitle = "Welcome Page | Nakpanduri Presby SHTS";
const ogDescription =
  "Shaping future leaders through academic excellence, character formation, and holistic development in Nakpanduri, Ghana.";

export const metadata: Metadata = {
  title: "Welcome Page",
  description:
    "Discover Presbyterian SHTS (NPRESEC) - a premier senior high school in Nakpanduri, North East Region of Ghana.",

  keywords: [
    "NPRESEC",
    "Presbyterian SHTS",
    "Nakpanduri",
    "Senior High School Ghana",
    "Best SHS North East Region",
    "Academic Excellence Ghana",
  ],
  metadataBase: new URL(env.NEXT_PUBLIC_URL),

  authors: [{ name: "Presbyterian Senior High Technical School" }],
  creator: "NPRESEC",

  openGraph: {
    title: ogTitle,
    description: ogDescription,
    url: `${env.NEXT_PUBLIC_URL}`,
    siteName: "NPRESEC MIS",
    images: [
      {
        url: `/api/og?title=${ogTitle}&description=${ogDescription}`,
        width: 1200,
        height: 630,
        alt: "NPRESEC - Presbyterian Senior High Technical School",
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
    canonical: `${env.NEXT_PUBLIC_URL}`,
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <Features />
      <Statistics />
    </>
  );
}
