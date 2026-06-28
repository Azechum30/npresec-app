import type { Metadata } from "next";
import { Features } from "./_components/Features";
import { Hero } from "./_components/Hero";
import { Statistics } from "./_components/Statistics";
import { Welcome } from "./_components/Welcome";

export const metadata: Metadata = {
  title: "Landing Page",
  description: "",
  keywords: ["Home", "Presby SHTS", "Management information system"],
  robots: {
    index: true,
    follow: true,
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
