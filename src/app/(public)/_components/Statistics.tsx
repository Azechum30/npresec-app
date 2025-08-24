"use client";

import { PublicMainContainer } from "./PublicMainContainer";
import Image from "next/image";
import PencilsBackground from "@/../public/Pencils.jpg";
import { CountUpComponent } from "@/components/customComponents/CountUpComponent";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export const Statistics = () => {
  const statisticsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: statisticsRef.current,
        },
      });

      tl.from(".container", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power2.inOut",
      });
      tl.from(".grid-image", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        scale: 0.8,
      });
      tl.from(".grid-container", {
        width: 0,
        duration: 1.5,
        ease: "power2.inOut",
      });
      tl.from(".grid-children", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        stagger: 0.2,
      });
    },
    { scope: statisticsRef } // This replaces the need for gsap.context()
  );

  return (
    <div ref={statisticsRef} className="w-full relative ">
      <div className="fixed bottom-0 -z-10 container">
        <Image
          src={PencilsBackground}
          alt="pencils background"
          className="w-full h-full object-cover object-center opacity-25 grid-image"
        />
      </div>
      <PublicMainContainer className="py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-4 md:mx-6 lg:mx-10 p-6 bg-primary/90 dark:bg-background/90 grid-container">
          <div className="flex flex-col gap-2 items-center justify-center text-white border p-8 grid-children">
            <h4 className="text-5xl font-bold tracking-tight ">
              <CountUpComponent countTo={2012} />
            </h4>
            <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
              School Inauguration
            </h4>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center text-white border p-8 grid-children">
            <h4 className="relative text-5xl font-bold tracking-tight ">
              <CountUpComponent countTo={600} />
              <span className="absolute -top-1 -right-2 z-10 text-base">+</span>
            </h4>
            <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
              Students Enrolled
            </h4>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center text-white border p-8 grid-children">
            <h4 className="relative text-5xl font-bold tracking-tight ">
              <CountUpComponent countTo={5} />
              <span className="absolute -top-1 -right-2 z-10 text-base">+</span>
            </h4>
            <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
              Learning Areas
            </h4>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center text-white border p-8 grid-children">
            <h4 className="relative text-5xl font-bold tracking-tight ">
              <CountUpComponent countTo={50} />
              <span className="absolute -top-1 -right-2 z-10 text-base">+</span>
            </h4>
            <h4 className="text-xl font-medium pb-4 relative after:absolute after:bottom-0 after:inset-0 after:border-b-4 after:border-white after:w-[50px] after:mx-auto">
              Teaching Staff
            </h4>
          </div>
        </div>
      </PublicMainContainer>
    </div>
  );
};
