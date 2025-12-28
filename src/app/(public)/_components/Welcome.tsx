"use client";
import { PublicMainContainer } from "./PublicMainContainer";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import React, { ReactNode, useRef } from "react";
import CarouselImage1 from "@/../public/carousel-image1.jpg";
import CarouselImage2 from "@/../public/carousel-image2.jpg";
import {
  BookOpenText,
  Expand,
  Users2,
  Award,
  UserRoundCheckIcon,
} from "lucide-react";
import { CarouselComponent } from "./CarouselComponent";
import { Separator } from "@/components/ui/separator";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Route } from "next";

type KeyLinksProps = {
  name: string;
  href: string;
  icon: ReactNode;
};

const CarouselImages = [CarouselImage1, CarouselImage2];
const keyLinks: KeyLinksProps[] = [
  {
    name: "Admissions List",
    href: "/admission",
    icon: <BookOpenText className="size-6" />,
  },
  {
    name: "Learning Areas or Programs",
    href: "/programs",
    icon: <Expand className="size-6" />,
  },
  {
    name: "Students Portal",
    href: "/students",
    icon: <Users2 className="size-6" />,
  },
  {
    name: "Alumini Platform",
    href: "/alumini-platform",
    icon: <Award className="size-6" />,
  },
  {
    name: "Teachers Portal",
    href: "/teachers",
    icon: <UserRoundCheckIcon className="size-6" />,
  },
];

gsap.registerPlugin(useGSAP);
gsap.registerPlugin(ScrollTrigger);

export const Welcome = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".welcome",
        },
      });
      const ctx = gsap.context(() => {
        tl.from(".welcome", {
          opacity: 0,
          y: 100,
          duration: 1,
          stagger: 0.5,
          ease: "power2.inOut",
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section className="bg-background welcome" ref={sectionRef}>
      <PublicMainContainer className="py-20 bg-background">
        <div className="px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col gap-4 welcome">
            <h2 className="text-xl font-medium relative pb-4 after:absolute after:z-0 after:bottom-0 after:w-1/4 inset-0 after:border-b-2 after:border-primary after:flex after:justify-start text-orange-500">
              Welcome Message
            </h2>
            <p className="leading-loose">
              Welcome to Presbyterian Senior High Technical School (NPRESEC), a
              premier government assisted senior high school of the North East
              Region of Ghana established at Nakpanduri in the
              Bunkprugu-Nakpanduri District.{" "}
            </p>
            <p className="leading-loose">
              We are dedicated to the well-being and success of our students,
              providing them with extra-ordinary experiences and networks that
              allow them to grow and develop ...
            </p>
            <Link
              href="/about"
              className={buttonVariants({
                variant: "link",
                className: "h-auto justify-start p-0",
              })}
            >
              <span>Read More</span>
              <ArrowRight className="size-4 opacity-60" />
            </Link>
          </div>
          <div className="mx-auto lg:max-w-sm md:ml-6 welcome">
            <CarouselComponent images={CarouselImages} />
          </div>
          <div className="flex md:hidden lg:flex flex-col gap-3 lg:ml-6 welcome">
            <h1 className="text-xl font-medium relative pb-4 after:absolute after:z-0 after:bottom-0 after:w-1/4 inset-0 after:border-b-2 after:border-primary after:flex after:justify-start text-orange-500">
              Key Links
            </h1>
            {keyLinks.map((link, index) => (
              <React.Fragment key={link.name}>
                <Link
                  key={link.name}
                  href={link.href as Route}
                  className={buttonVariants({
                    variant: "link",
                    className: "justify-start text-base gap-8",
                  })}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
                {index < keyLinks.length - 1 && (
                  <Separator className="opacity-30" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </PublicMainContainer>
    </section>
  );
};
