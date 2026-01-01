"use client";

import { useRef, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PublicMainContainer } from "./PublicMainContainer";
import BackgroundImage from "@/../public/background.jpg";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Library, ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { useGSAP } from "@gsap/react";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);

export const Hero = () => {
  const container = useRef<HTMLElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Main animation timeline
  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".hero-badge", { opacity: 0, y: 50, scale: 0.8 });
      gsap.set(".hero-title-word", { opacity: 0, y: 80, rotationX: 90 });
      gsap.set(".hero-description", {
        opacity: 0,
        y: 60,
        clipPath: "inset(100% 0 0 0)",
      });
      gsap.set(".hero-button", { opacity: 0, y: 50, scale: 0.9 });
      gsap.set(".hero-scroll-indicator", { opacity: 0, y: 30 });
      gsap.set(".hero-background", { scale: 1.1, opacity: 0 });
      gsap.set(".hero-overlay", { opacity: 0 });

      // Create main timeline
      const mainTl = gsap.timeline({
        delay: 0.3,
        onComplete: () => setIsLoaded(true),
      });

      // Background animation
      mainTl
        .to(".hero-background", {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power2.out",
        })
        .to(
          ".hero-overlay",
          {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          "-=1.5",
        )

        // Badge animation with bounce
        .to(
          ".hero-badge",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.8",
        )

        // Title words animation with stagger
        .to(
          ".hero-title-word",
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1.2,
            stagger: {
              amount: 0.6,
              from: "start",
              ease: "power2.out",
            },
            ease: "back.out(1.2)",
          },
          "-=0.5",
        )

        // Description with clip-path reveal
        .to(
          ".hero-description",
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1.5,
            ease: "power2.out",
          },
          "-=0.8",
        )

        // Buttons with stagger and scale
        .to(
          ".hero-button",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.4)",
          },
          "-=0.6",
        )

        // Scroll indicator
        .to(
          ".hero-scroll-indicator",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3",
        );

      // Parallax effect for background
      if (typeof window !== "undefined") {
        gsap.to(".hero-background", {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      // Floating animation for badge
      gsap.to(".hero-badge", {
        y: -5,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 2,
      });

      // Pulse animation for scroll indicator
      gsap.to(".scroll-chevron", {
        y: 10,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 3,
      });

      // Enhanced button hover animations
      const buttons = container.current.querySelectorAll(".hero-button");
      buttons.forEach((button) => {
        const btn = button as HTMLElement;

        btn.addEventListener("mouseenter", () => {
          gsap.to(btn, {
            scale: 1.05,
            y: -3,
            duration: 0.3,
            ease: "power2.out",
          });
        });

        btn.addEventListener("mouseleave", () => {
          gsap.to(btn, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          });
        });
      });

      // Cleanup function
      return () => {
        mainTl.kill();
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: container },
  );

  // Smooth scroll to next section
  const scrollToNext = () => {
    const nextSection = container.current?.nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      ref={container}
      className="relative w-full min-h-screen overflow-hidden"
    >
      {/* Background Image */}
      <div ref={backgroundRef} className="absolute inset-0 hero-background">
        <Image
          src={BackgroundImage}
          alt="Presbyterian SHTS Nakpanduri Campus"
          className="h-full w-full object-cover object-center"
          priority
          quality={90}
          placeholder="blur"
        />
      </div>

      {/* Overlay */}
      <div className="hero-overlay absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background/90 dark:from-background/85 dark:via-background/90 dark:to-background/95" />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 flex min-h-screen items-center justify-center"
      >
        <PublicMainContainer className="py-20">
          <div className="flex flex-col text-center items-center space-y-8 max-w-4xl mx-auto">
            {/* Badge */}
            <Badge
              variant="outline"
              className="hero-badge px-6 py-2 text-sm font-medium border-primary/30 bg-background/80 backdrop-blur-sm hover:bg-primary/10 transition-colors duration-300"
            >
              An Institution of Academic Excellence
            </Badge>

            {/* Title */}
            <h1 className="tracking-tight text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="hero-title-word inline-block bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
                Presbyterian
              </span>{" "}
              <span className="hero-title-word inline-block text-foreground">
                SHTS,
              </span>{" "}
              <span className="hero-title-word inline-block text-foreground">
                Nakpanduri
              </span>
            </h1>

            {/* Description */}
            <div className="hero-description max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                At Presbyterian SHTS, we nurture curiosity, character, and
                creativity—preparing students to thrive academically, socially,
                and beyond. From innovative classrooms to vibrant student life,
                we create a foundation where ambition meets opportunity.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                href={"/programs" as Route}
                className={`hero-button ${buttonVariants({
                  size: "lg",
                  className:
                    "group relative overflow-hidden px-8 py-4 text-base font-semibold",
                })}`}
              >
                <Library className="size-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                <span className="relative z-10">Learning Areas</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>

              <Link
                href="/about"
                className={`hero-button ${buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className:
                    "group px-8 py-4 text-base font-semibold border-2 hover:border-primary/50",
                })}`}
              >
                <span className="group-hover:tracking-wider transition-all duration-300">
                  About Us
                </span>
              </Link>
            </div>

            {/* Scroll Indicator */}
            <div className="hero-scroll-indicator absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <button
                onClick={scrollToNext}
                className="flex flex-col items-center space-y-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
                aria-label="Scroll to next section"
              >
                <span className="text-sm font-medium">Explore More</span>
                <ChevronDown className="scroll-chevron size-6 group-hover:scale-110 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </PublicMainContainer>
      </div>

      {/* Decorative Elements */}
      {isLoaded && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
          <div className="absolute top-1/3 right-16 w-3 h-3 bg-orange-400/20 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-20 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-pulse delay-2000" />
        </div>
      )}
    </section>
  );
};
