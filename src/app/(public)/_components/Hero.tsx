"use client";

import { useRef } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PublicMainContainer } from "./PublicMainContainer";
import BackgroundImage from "@/../public/background.jpg";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Library } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);
gsap.registerPlugin(SplitText);

export const Hero = () => {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      let split = SplitText.create(".title", {
        type: "chars",
        smartWrap: true,
      });

      const tl = gsap.timeline();

      const cxt = gsap.context(() => {
        tl.from(".backgroundImage", {
          opacity: 0,
          scale: 0.8,
          duration: 2,
          ease: "power2.inOut",
        });

        tl.from(".badge", {
          opacity: 0,
          y: 100,
          duration: 2,
        });

        tl.from(".title", {
          opacity: 0,
          duration: 2,
          y: 100,
        });

        tl.from(".description", {
          y: 100,
          opacity: 0,
          duration: 2,
        });

        tl.from(".button", {
          y: 100,
          opacity: 0,
          duration: 2,
        });
      }, container);

      return () => cxt.revert();
    },

    { scope: container }
  );

  return (
    <section ref={container} className="relative w-full">
      <Image
        src={BackgroundImage}
        alt="Background image"
        className="h-svh object-cover object-center backgroundImage"
      />
      <div className="w-full absolute top-0 z-10 bg-background/80 dark:bg-background/95 h-svh hero flex items-center justify-center">
        <PublicMainContainer className="relative py-20">
          <div className="flex flex-col text-center  items-center space-y-8">
            <Badge
              variant="outline"
              className="badge dark:text-primary-foreground">
              An Institution of Academic Excellence
            </Badge>
            <h1 className="tracking-tight text-4xl md:text-6xl font-bold title dark:text-primary-foreground">
              <span className="bg-gradient-to-l from-orange-500 to-pink-500 bg-clip-text bg-transparent">
                Presbyterian
              </span>{" "}
              SHTS, Nakpanduri
            </h1>
            <p className="max-w-xl mx-auto dark:text-primary-foreground/95 description">
              At Presbyterian SHTS, we nurture curiosity, character, and
              creativity—preparing students to thrive academically, socially,
              and beyond. From innovative classrooms to vibrant student life, we
              create a foundation where ambition meets opportunity.
            </p>

            <div className="flex flex-col md:flex-row md:items-center gap-4 button ">
              <Link
                href="/programs"
                className={buttonVariants({
                  size: "lg",
                  className: "hover:-translate-x-4 duration-100 ease-in-out ",
                })}>
                <Library className="size-6 opacity-60" aria-hidden={true} />
                Learning Areas
              </Link>
              <Link
                href="/about"
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "hover:translate-x-4 duration-100 ease-in-out",
                })}>
                About Us
              </Link>
            </div>
          </div>
        </PublicMainContainer>
      </div>
    </section>
  );
};
