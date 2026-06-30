/** biome-ignore-all assist/source/organizeImports: reason */

import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import { Features } from "./_components/Features";
import { Hero } from "./_components/Hero";
import { Statistics } from "./_components/Statistics";
import { Welcome } from "./_components/Welcome";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover Presbyterian Senior High Technical School (NPRESEC) - a premier government-assisted senior high school in Nakpanduri, North East Region of Ghana. Excellence in academics, character development, and practical skills.",

  keywords: [
    "NPRESEC",
    "Presbyterian SHTS",
    "Nakpanduri",
    "Senior High School Ghana",
    "Best SHS North East Region",
    "Academic Excellence Ghana",
  ],

  authors: [{ name: "Presbyterian Senior High Technical School" }],
  creator: "NPRESEC",

  openGraph: {
    title: "Presbyterian Senior High Technical School (NPRESEC) | Nakpanduri",
    description:
      "Shaping future leaders through academic excellence, character formation, and holistic development in Nakpanduri, Ghana.",
    url: `${env.NEXT_PUBLIC_URL}`,
    siteName: "NPRESEC MIS",
    images: [
      {
        url: "/opengraph-image",
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
    title: "NPRESEC | Presbyterian Senior High Technical School",
    description:
      "A leading senior high school in Nakpanduri dedicated to academic excellence and holistic student development.",
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
