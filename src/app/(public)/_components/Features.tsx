"use client";

import { useRef, useState } from "react";
import { PublicMainContainer } from "./PublicMainContainer";
import {
  Network,
  Users2Icon,
  TrendingUp,
  Computer,
  Palette,
  Utensils,
  Clapperboard,
  Tractor,
  CircuitBoard,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const features = [
  {
    icon: Network,
    title: "Academic Excellence",
    description:
      "We help students discover and cultivate their unique strengths, with a strong focus on academic performance. Each learner is paired with a dedicated academic counselor or advisor who actively supports their growth. When challenges arise, tailored interventions are implemented to guide students back on track and empower them to excel.",
    color: "from-blue-500 to-cyan-500",
    delay: 0,
  },
  {
    icon: Users2Icon,
    title: "Our Staff",
    description:
      "Our devoted staff are the heart of our academic mission, passionately guiding students toward excellence. With unwavering professionalism, they carry out their responsibilities with care and integrity—committed to empowering learners both cognitively and psychosocially, fostering growth in mind and spirit.",
    color: "from-purple-500 to-pink-500",
    delay: 0.2,
  },
  {
    icon: TrendingUp,
    title: "Skill Development",
    description:
      "We go beyond nurturing students' cognitive abilities by actively engaging them in enriching co-curricular activities like sports, debates, and drama. These experiences are thoughtfully integrated to shape well-rounded individuals, prepared to thrive and contribute meaningfully to our ever-evolving global society.",
    color: "from-green-500 to-emerald-500",
    delay: 0.4,
  },
];

const learningAreas = [
  {
    icon: Palette,
    name: "General Arts",
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
  },
  {
    icon: Utensils,
    name: "Home Economics",
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    icon: CircuitBoard,
    name: "Applied Technology",
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    icon: Clapperboard,
    name: "Visual & Performing Arts",
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    icon: Tractor,
    name: "Agriculture",
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    icon: Computer,
    name: "Computer Science",
    color: "text-cyan-500",
    bgColor: "bg-cyan-50 dark:bg-cyan-950/20",
  },
];

export const Features = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [hoveredArea, setHoveredArea] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".features-container", { opacity: 0, y: 100 });
      gsap.set(".features-badge", { opacity: 0, scale: 0, rotation: -180 });
      gsap.set(".features-title", { opacity: 0, y: 50, skewY: 10 });
      gsap.set(".feature-card", {
        opacity: 0,
        y: 80,
        scale: 0.8,
        rotationX: 45,
      });
      gsap.set(".courses-section", { opacity: 0, y: 60 });
      gsap.set(".course-item", {
        opacity: 0,
        x: -50,
        scale: 0.9,
      });
      gsap.set(".cta-buttons", { opacity: 0, y: 40, scale: 0.95 });

      // Main timeline with ScrollTrigger
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      });

      // Container entrance
      mainTl
        .to(".features-container", {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })

        // Badge with spinning entrance
        .to(
          ".features-badge",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.8",
        )

        // Title with skew animation
        .to(
          ".features-title",
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.6",
        )

        // Feature cards with 3D flip
        .to(
          ".feature-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.2,
            stagger: {
              amount: 0.6,
              from: "start",
              ease: "power2.out",
            },
            ease: "back.out(1.3)",
          },
          "-=0.4",
        )

        // Courses section
        .to(
          ".courses-section",
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8",
        )

        // Course items with wave effect
        .to(
          ".course-item",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: {
              amount: 0.8,
              from: "start",
              ease: "power2.out",
            },
            ease: "back.out(1.2)",
          },
          "-=0.6",
        )

        // CTA buttons
        .to(
          ".cta-buttons",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)",
          },
          "-=0.4",
        );

      // Floating animation for badge
      gsap.to(".features-badge", {
        y: -8,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 2,
      });

      // Parallax effect for feature cards
      gsap.to(".feature-card", {
        y: (i) => -30 * (i + 1),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: container },
  );

  // Feature card hover animations
  const handleFeatureHover = (index: number, isEntering: boolean) => {
    setHoveredFeature(isEntering ? index : null);

    const card = container.current?.querySelector(`.feature-card-${index}`);
    if (!card) return;

    gsap.to(card, {
      scale: isEntering ? 1.05 : 1,
      y: isEntering ? -10 : 0,
      rotationY: isEntering ? 5 : 0,
      duration: 0.4,
      ease: "power2.out",
    });

    // Icon animation
    gsap.to(card.querySelector(".feature-icon"), {
      scale: isEntering ? 1.2 : 1,
      rotation: isEntering ? 10 : 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  };

  // Learning area hover animations
  const handleAreaHover = (index: number, isEntering: boolean) => {
    setHoveredArea(isEntering ? index : null);

    const item = container.current?.querySelector(`.course-item-${index}`);
    if (!item) return;

    gsap.to(item, {
      scale: isEntering ? 1.08 : 1,
      x: isEntering ? 10 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={container}
      className="w-full bg-gradient-to-b from-accent/50 to-background py-8 md:py-12 lg:py-24 px-4 md:px-6 lg:px-16 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/3 to-blue-500/3 rounded-full blur-3xl" />
      </div>

      <PublicMainContainer className="features-container relative bg-background/80 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl p-8 md:p-12">
        {/* Features Section */}
        <div className="text-center mb-16">
          <div className="features-badge inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full border border-primary/20 mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">@NPRESEC</span>
          </div>

          <h1 className="features-title text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Why Choose Us
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover what makes Presbyterian SHTS Nakpanduri the ideal choice
            for academic excellence and holistic development.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`feature-card feature-card-${index} group relative p-8 rounded-2xl border border-border/50 bg-gradient-to-br from-background to-accent/20 hover:shadow-xl transition-all duration-500 cursor-pointer overflow-hidden`}
                onMouseEnter={() => handleFeatureHover(index, true)}
                onMouseLeave={() => handleFeatureHover(index, false)}
              >
                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                />

                {/* Icon container */}
                <div
                  className={`feature-icon relative z-10 w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br ${feature.color} p-0.5`}
                >
                  <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                    <Icon className="w-8 h-8 text-foreground group-hover:text-white transition-colors duration-300" />
                  </div>
                </div>

                <h3 className="text-xl font-bold text-center mb-4 group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed text-center group-hover:text-foreground transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover effect decoration */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            );
          })}
        </div>

        <Separator className="w-full opacity-40 my-12" />

        {/* Learning Areas Section */}
        <div className="courses-section">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4 relative inline-block">
              Learning Areas
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-primary to-orange-500 rounded-full" />
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Explore our diverse range of academic programs designed to nurture
              your interests and talents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {learningAreas.map((area, index) => {
              const Icon = area.icon;
              return (
                <div
                  key={index}
                  className={`course-item course-item-${index} group relative p-6 rounded-xl ${area.bgColor} border border-border/30 hover:border-current transition-all duration-300 cursor-pointer`}
                  onMouseEnter={() => handleAreaHover(index, true)}
                  onMouseLeave={() => handleAreaHover(index, false)}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${area.color} bg-white dark:bg-background transition-transform duration-300 group-hover:scale-110`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3
                        className={`font-semibold ${area.color} group-hover:scale-105 transition-transform duration-300`}
                      >
                        {area.name}
                      </h3>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 ${area.color} opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="cta-buttons relative flex flex-col sm:flex-row gap-4 w-fit mx-auto">
            <Link
              href={"/requirements" as Route}
              className={`${buttonVariants({
                size: "lg",
                className:
                  "group relative overflow-hidden px-8 py-4 rounded-l-full sm:rounded-r-none rounded-r-full text-base font-semibold",
              })} hover:shadow-lg transition-all duration-300`}
            >
              <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                Requirements
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>

            <Link
              href={"/programs" as Route}
              className={`${buttonVariants({
                variant: "destructive",
                size: "lg",
                className:
                  "group relative overflow-hidden px-8 py-4 rounded-r-full sm:rounded-l-none rounded-l-full text-base font-semibold",
              })} hover:shadow-lg transition-all duration-300`}
            >
              <span className="relative z-10 group-hover:tracking-wider transition-all duration-300">
                Programmes
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-destructive/0 via-white/20 to-destructive/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </Link>

            {/* OR divider */}
            <div className="absolute z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border-4 border-border w-12 h-12 rounded-full flex items-center justify-center text-xs font-bold text-primary shadow-lg">
              OR
            </div>
            <div className="absolute z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-primary/20 to-destructive/20 w-16 h-16 rounded-full blur-sm" />
          </div>
        </div>
      </PublicMainContainer>
    </div>
  );
};
