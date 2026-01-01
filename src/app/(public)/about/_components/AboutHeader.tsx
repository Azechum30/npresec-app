"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  ChevronRight,
  Sparkles,
  Users,
  BookOpen,
  Award,
  ArrowDown,
  Building2,
  Heart,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import Logo from "@/../public/logo.png";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, useGSAP);

export const AboutHeader = () => {
  const container = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const stats = [
    { icon: Users, label: "Students", value: "500+" },
    { icon: BookOpen, label: "Programs", value: "6" },
    { icon: Award, label: "Years", value: "32+" },
  ];

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".about-background", { scale: 1.2, opacity: 0 });
      gsap.set(".about-overlay", { opacity: 0 });
      gsap.set(".about-badge", { opacity: 0, y: 50, scale: 0.8 });
      gsap.set(".about-breadcrumb", { opacity: 0, x: -30 });
      gsap.set(".about-title-word", { opacity: 0, y: 100, rotationX: 90 });
      gsap.set(".about-description", {
        opacity: 0,
        y: 60,
        clipPath: "inset(100% 0 0 0)",
      });
      gsap.set(".about-stat", { opacity: 0, y: 50, scale: 0.9 });
      gsap.set(".about-scroll-indicator", { opacity: 0, y: 30 });
      gsap.set(".about-decoration", { opacity: 0, scale: 0, rotation: -45 });

      // Create main timeline
      const mainTl = gsap.timeline({
        delay: 0.2,
        onComplete: () => setIsLoaded(true),
      });

      // Background animation
      mainTl
        .to(".about-background", {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
        })
        .to(
          ".about-overlay",
          {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.8",
        )

        // Badge entrance
        .to(".about-badge", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
        })

        // Breadcrumb
        .to(
          ".about-breadcrumb",
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        )

        // Title animation
        .to(".about-title-word", {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        })

        // Description
        .to(".about-description", {
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0 0 0)",
          duration: 0.8,
          ease: "power2.out",
        })

        // Stats animation
        .to(
          ".about-stat",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        )

        // Decorations
        .to(
          ".about-decoration",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.6",
        )

        // Scroll indicator
        .to(".about-scroll-indicator", {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        });

      // Parallax effect for background
      gsap.to(".about-background", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Floating animation for decorations
      gsap.to(".floating-decoration", {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });
    },
    { scope: container },
  );

  return (
    <div ref={container} className="relative overflow-hidden min-h-[60vh]">
      {/* Background */}
      <div className="about-background absolute inset-0 z-0">
        <Image
          src={Logo}
          alt="NPRESEC Background"
          fill
          className="object-contain opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-secondary/90" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-background/10" />
      </div>

      {/* Glassmorphism overlay */}
      <div className="about-overlay absolute inset-0 z-10 backdrop-blur-sm bg-black/10" />

      {/* Floating decorations */}
      <div className="about-decoration floating-decoration absolute top-20 right-20 z-20">
        <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-20 blur-sm" />
      </div>
      <div className="about-decoration floating-decoration absolute bottom-32 left-16 z-20">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-30 blur-sm" />
      </div>
      <div className="about-decoration floating-decoration absolute top-1/2 right-1/4 z-20">
        <Sparkles className="w-8 h-8 text-white/30" />
      </div>

      {/* Main content */}
      <div className="relative z-30 flex flex-col justify-center min-h-[60vh] px-4 md:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto w-full">
          {/* Badge */}
          <div className="about-badge flex justify-center mb-6">
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 transition-all duration-300"
            >
              <Building2 className="w-4 h-4 mr-2" />
              Discover Our Story
            </Badge>
          </div>

          {/* Breadcrumb */}
          <div className="about-breadcrumb flex items-center justify-center mb-8">
            <nav className="flex items-center space-x-2 text-white/80">
              <Link
                href={"/" as Route}
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "text-white/80 hover:text-white hover:bg-white/10",
                })}
              >
                <Home className="w-4 h-4" />
              </Link>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-white">About</span>
            </nav>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {["About", "Our", "School"].map((word, index) => (
                <span
                  key={index}
                  className="about-title-word inline-block mr-3 bg-gradient-to-r from-white to-white/90 bg-clip-text"
                >
                  {word}
                </span>
              ))}
            </h1>

            <div className="about-description max-w-2xl mx-auto">
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Discover the rich heritage and inspiring journey of Nakpanduri
                Presbyterian Senior High Technical School, where academic
                excellence meets character development.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {stats.map((stat, index) => (
              <div key={stat.label} className="about-stat group cursor-default">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center transition-all duration-300 group-hover:bg-white/20 group-hover:scale-105 group-hover:border-white/30">
                  <stat.icon className="w-8 h-8 text-white mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-white/80 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="about-scroll-indicator flex justify-center">
            <div className="group cursor-pointer">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-3 group-hover:bg-white/20 transition-all duration-300">
                <ArrowDown className="w-5 h-5 text-white group-hover:translate-y-1 transition-transform duration-300" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
