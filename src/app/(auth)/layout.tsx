"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/../public/logo.png";
import { ArrowLeft, Sparkles, Shield, Eye, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const container = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".auth-background", { opacity: 0, scale: 1.1 });
      gsap.set(".auth-overlay", { opacity: 0 });
      gsap.set(".auth-back-button", { opacity: 0, x: -30, scale: 0.8 });
      gsap.set(".auth-logo", { opacity: 0, y: -30, scale: 0.9 });
      gsap.set(".auth-content", { opacity: 0, y: 50, scale: 0.95 });
      gsap.set(".auth-footer", { opacity: 0, y: 20 });
      gsap.set(".floating-auth-decoration", {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });

      // Main entrance timeline
      const mainTl = gsap.timeline({
        delay: 0.1,
        onComplete: () => setIsLoaded(true),
      });

      mainTl
        .to(".auth-background", {
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power2.out",
        })
        .to(
          ".auth-overlay",
          {
            opacity: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=1",
        )
        .to(
          ".auth-back-button",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.8",
        )
        .to(
          ".auth-logo",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        )
        .to(
          ".auth-content",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.2)",
          },
          "-=0.3",
        )
        .to(
          ".auth-footer",
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.2",
        );

      // Floating decorations
      gsap.to(".floating-auth-decoration", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
        delay: 0.8,
      });

      // Continuous floating animation
      gsap.to(".floating-auth-element", {
        y: -20,
        rotation: 15,
        duration: 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 1,
      });

      // Parallax effect for background elements
      gsap.to(".parallax-bg", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      className="relative flex items-center justify-center w-full min-h-svh overflow-hidden"
    >
      {/* Animated background */}
      <div className="auth-background fixed inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-slate-900 dark:via-blue-950/30 dark:to-purple-950/20" />

        {/* Animated gradient orbs */}
        <div className="parallax-bg absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="parallax-bg absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="parallax-bg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Glassmorphism overlay */}
      <div className="auth-overlay fixed inset-0 z-10 backdrop-blur-sm bg-white/10 dark:bg-black/10" />

      {/* Floating decorations */}
      <div className="floating-auth-decoration floating-auth-element fixed top-20 right-20 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg pointer-events-none z-20" />
      <div className="floating-auth-decoration floating-auth-element fixed bottom-32 left-16 w-12 h-12 bg-gradient-to-br from-accent/25 to-primary/25 rounded-full blur-md pointer-events-none z-20" />
      <div className="floating-auth-decoration floating-auth-element fixed top-1/2 right-1/3 w-8 h-8 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-sm pointer-events-none z-20" />

      {/* Sparkle decorations */}
      <div className="floating-auth-decoration fixed top-24 left-1/3 z-20 pointer-events-none">
        <Sparkles className="w-6 h-6 text-primary/30" />
      </div>
      <div className="floating-auth-decoration fixed bottom-24 right-1/3 z-20 pointer-events-none">
        <Star className="w-5 h-5 text-secondary/40" />
      </div>
      <div className="floating-auth-decoration fixed top-1/3 left-20 z-20 pointer-events-none">
        <Shield className="w-4 h-4 text-accent/35" />
      </div>

      {/* Main content */}
      <div className="relative z-30 w-full">
        {/* Back button */}
        <div className="auth-back-button absolute top-4 left-4 md:top-6 md:left-6">
          <Link
            href={"/" as Route}
            className={buttonVariants({
              variant: "outline",
              className:
                "relative overflow-hidden bg-background/60 backdrop-blur-md border-border/50 hover:bg-background/80 hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl",
            })}
            onMouseEnter={() => setHoveredElement("back-button")}
            onMouseLeave={() => setHoveredElement(null)}
          >
            {/* Shimmer effect */}
            <div
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ${
                hoveredElement === "back-button" ? "translate-x-full" : ""
              }`}
            />
            <div className="relative flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </div>
          </Link>
        </div>

        {/* Content container */}
        <div className="flex w-full flex-col items-center justify-center min-h-svh px-4 py-16">
          <div className="w-full max-w-md space-y-8">
            {/* Logo and branding */}
            <div className="auth-logo flex flex-col items-center space-y-4">
              <Link
                href={"/" as Route}
                className="group relative flex items-center gap-3 transition-all duration-300 hover:scale-105"
                onMouseEnter={() => setHoveredElement("logo")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {/* Logo glow effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-lg opacity-0 transition-opacity duration-300 ${
                    hoveredElement === "logo" ? "opacity-100" : ""
                  }`}
                />

                <div className="relative w-12 h-12 p-2 bg-gradient-to-br from-background/80 to-accent/20 backdrop-blur-md border border-border/50 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={Logo}
                    alt="NPRESEC Logo"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Presby SHTS
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Excellence in Education
                  </span>
                </div>
              </Link>

              {/* Subtitle */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground max-w-xs">
                  Secure access to your educational dashboard
                </p>
              </div>
            </div>

            {/* Main content (SignInForm) */}
            <div className="auth-content">{children}</div>

            {/* Terms footer */}
            <div className="auth-footer text-center">
              <div className="bg-background/60 backdrop-blur-md border border-border/30 rounded-2xl p-4 shadow-lg">
                <p className="text-xs text-muted-foreground text-balance leading-relaxed">
                  By signing in, you agree to our{" "}
                  <button
                    className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline decoration-primary/30 hover:decoration-primary/60"
                    onMouseEnter={() => setHoveredElement("terms")}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 underline decoration-primary/30 hover:decoration-primary/60"
                    onMouseEnter={() => setHoveredElement("privacy")}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
