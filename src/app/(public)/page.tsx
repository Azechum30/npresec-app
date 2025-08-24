import Image from "next/image";

import PencilsBackground from "@/../public/Pencils.jpg";
import { PublicMainContainer } from "./_components/PublicMainContainer";

import React from "react";
import { CountUpComponent } from "@/components/customComponents/CountUpComponent";
import { Hero } from "./_components/Hero";
import { Welcome } from "./_components/Welcome";
import { Features } from "./_components/Features";
import { Statistics } from "./_components/Statistics";

export const metadata = {
  title: "Home",
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
