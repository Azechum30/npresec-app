import Image from "next/image";
import Link from "next/link";
import PencilsBackground from "@/../public/Pencils.jpg";
import { PublicMainContainer } from "./_components/PublicMainContainer";
import { buttonVariants } from "@/components/ui/button";
import {
  CircuitBoard,
  Clapperboard,
  Computer,
  Network,
  Palette,
  Tractor,
  TrendingUp,
  Users2Icon,
  Utensils,
} from "lucide-react";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { CountUpComponent } from "@/components/customComponents/CountUpComponent";
import { Hero } from "./_components/Hero";
import { Welcome } from "./_components/Welcome";

export const metadata = {
  title: "Home",
};

export default function Home() {
  return (
    <>
      <Hero />
      <Welcome />
      <div className="w-full dark:bg-gray-900 bg-gray-200 py-4 md:py-6 lg:py-20 px-4 md:px-6 lg:px-16 shadow-2xl hover:transition-shadow">
        <PublicMainContainer className="bg-background p-4">
          <h1 className="text-2xl text-orange-500 font-semibold text-center py-4 relative after:absolute after:bottom-0 after:inset-0 after:w-[52px] after:border-b-2 after:border-primary after:mx-auto">
            @NPRESEC
          </h1>
          <div className="grid lg:grid-cols-3 gap-6 px-2 py-10">
            <div className="flex flex-col items-center space-y-6 rounded-lg border p-4">
              <Network className="size-8 text-orange-200" />
              <h4 className="text-primary font-medium text-xl">
                Academic Excellence
              </h4>
              <p className="leading-loose">
                We help students discover and cultivate their unique strengths,
                with a strong focus on academic performance. Each learner is
                paired with a dedicated academic counselor or advisor who
                actively supports their growth. When challenges arise, tailored
                interventions are implemented to guide students back on track
                and empower them to excel.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-6 rounded-lg border p-4">
              <Users2Icon className="size-8 text-orange-200" />
              <h4 className="text-primary font-medium text-xl">Our Staff</h4>
              <p className="leading-loose">
                Our devoted staff are the heart of our academic mission,
                passionately guiding students toward excellence. With unwavering
                professionalism, they carry out their responsibilities with care
                and integrity—committed to empowering learners both cognitively
                and psychosocially, fostering growth in mind and spirit.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-6 rounded-lg border p-4">
              <TrendingUp className="size-8 text-orange-200" />
              <h4 className="text-primary font-medium text-xl">
                Skill Development
              </h4>
              <p className="leading-loose">
                We go beyond nurturing students' cognitive abilities by actively
                engaging them in enriching co-curricular activities like sports,
                debates, and drama. These experiences are thoughtfully
                integrated to shape well-rounded individuals, prepared to thrive
                and contribute meaningfully to our ever-evolving global society.
              </p>
            </div>
          </div>
          <Separator className="w-full opacity-40 my-5" />
          <h1 className="text-2xl font-medium text-center relative pt-6 text-primary pb-4 after:absolute after:bottom-0 after:inset-0 after:z-0 after:mx-auto after:border-b-2 after:border-primary after:w-[52px]">
            Learning Areas
          </h1>
          <div className="py-10 grid lg:grid-cols-3 px-2 gap-y-2 lg:place-items-center">
            <div className="flex flex-col gap-2">
              <div className=" px-4 flex flex-col gap-2">
                <div className="flex items-center gap-8 hover:text-primary hover:underline hover:transition-colors">
                  <Palette className="size-6 opacity-60" />
                  <span>General Arts</span>
                </div>
                <Separator className="opacity-40" />
              </div>
              <div className=" px-4 flex flex-col gap-2">
                <div className="flex items-center gap-8 hover:text-primary hover:underline hover:transition-colors">
                  <Utensils className="size-6 opacity-60" />
                  <span>Home Economics</span>
                </div>
                <Separator className="opacity-40 lg:hidden" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className=" px-4 flex flex-col gap-2">
                <div className="flex items-center gap-8 hover:text-primary hover:underline hover:transition-colors">
                  <CircuitBoard className="size-6 opacity-60" />
                  <span>Applied Technology</span>
                </div>
                <Separator className="opacity-40" />
              </div>
              <div className=" px-4 flex flex-col gap-2">
                <div className="flex items-center gap-8 hover:text-primary hover:underline hover:transition-colors">
                  <Clapperboard className="size-6 opacity-60" />
                  <span>Visual & Performing Arts</span>
                </div>
                <Separator className="opacity-40 lg:hidden" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className=" px-4 flex flex-col gap-2">
                <div className="flex items-center gap-8 hover:text-primary hover:underline hover:transition-colors">
                  <Tractor className="size-6 opacity-60" />
                  <span>Agriculture</span>
                </div>
                <Separator className="opacity-40" />
              </div>
              <div className=" px-4 flex flex-col gap-2">
                <div className="flex items-center gap-8 hover:text-primary hover:underline hover:transition-colors">
                  <Computer className="size-6 opacity-60" />
                  <span>Computer Science</span>
                </div>
                {/* <Separator className="opacity-40 lg:hidden" /> */}
              </div>
            </div>
          </div>
          <div className="relative flex gap-2 w-fit mx-auto mb-10">
            <Link
              href="/requirements"
              className={buttonVariants({
                size: "lg",
                className: "rounded-bl-full rounded-tl-full py-7",
              })}>
              Requirements
            </Link>
            <Link
              href="/requirements"
              className={buttonVariants({
                variant: "destructive",
                size: "lg",
                className: "rounded-br-full rounded-tr-full py-7",
              })}>
              Programmes
            </Link>

            <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  bg-background p-1.5 h-8 w-8 rounded-full flex items-center justify-center shadow-2xl text-xs ">
              OR
            </div>
            <div className="absolute z-0 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/40 p-1.5 h-10.5 w-10.5 rounded-full flex items-center justify-center shadow-2xl " />
          </div>
        </PublicMainContainer>
      </div>
      <div className="w-full relative">
        <div className="fixed bottom-0 -z-10">
          <Image
            src={PencilsBackground}
            alt="pencils background"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <PublicMainContainer className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-4 md:mx-6 lg:mx-10 p-6 bg-primary/90 dark:bg-background/90">
            <div className="flex flex-col gap-2 items-center justify-center text-white border p-8">
              <h4 className="text-5xl font-bold tracking-tight ">
                <CountUpComponent countTo={2012} />
              </h4>
              <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
                School Inauguration
              </h4>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center text-white border p-8">
              <h4 className="relative text-5xl font-bold tracking-tight ">
                <CountUpComponent countTo={600} />
                <span className="absolute -top-1 -right-2 z-10 text-base">
                  +
                </span>
              </h4>
              <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
                Students Enrolled
              </h4>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center text-white border p-8">
              <h4 className="relative text-5xl font-bold tracking-tight ">
                <CountUpComponent countTo={5} />
                <span className="absolute -top-1 -right-2 z-10 text-base">
                  +
                </span>
              </h4>
              <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
                Learning Areas
              </h4>
            </div>
            <div className="flex flex-col gap-2 items-center justify-center text-white border p-8">
              <h4 className="text-3xl font-bold tracking-tight ">2012</h4>
              <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
                School Inauguration
              </h4>
            </div>
          </div>
        </PublicMainContainer>
      </div>
    </>
  );
}
