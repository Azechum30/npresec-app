"use client";

import { useRef, useState } from "react";
import { PublicMainContainer } from "./PublicMainContainer";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpenText,
  Expand,
  Users2,
  Award,
  UserRoundCheckIcon,
  Quote,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { CarouselComponent } from "./CarouselComponent";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Route } from "next";
import CarouselImage1 from "@/../public/carousel-image1.jpg";
import CarouselImage2 from "@/../public/carousel-image2.jpg";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const CarouselImages = [CarouselImage1, CarouselImage2];

const keyLinks = [
  {
    name: "Admissions List",
    href: "/admission",
    icon: BookOpenText,
    description: "View current admission requirements and accepted students",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    name: "Learning Areas",
    href: "/programs",
    icon: Expand,
    description: "Explore our diverse academic programs and specializations",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    name: "Students Portal",
    href: "/students",
    icon: Users2,
    description: "Access student resources and academic services",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    name: "Alumni Platform",
    href: "/alumni-platform",
    icon: Award,
    description: "Connect with our alumni network and success stories",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    name: "Teachers Portal",
    href: "/teachers",
    icon: UserRoundCheckIcon,
    description: "Faculty resources and teaching tools",
    color: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
  },
];

export const Welcome = () => {
  const container = useRef<HTMLElement>(null);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".welcome-container", { opacity: 0, y: 100 });
      gsap.set(".welcome-badge", { opacity: 0, scale: 0.5, rotation: -45 });
      gsap.set(".welcome-title", { opacity: 0, y: 60, skewX: -10 });
      gsap.set(".welcome-content", { opacity: 0, y: 80, scale: 0.95 });
      gsap.set(".carousel-container", {
        opacity: 0,
        scale: 0.8,
        rotationY: 45,
      });
      gsap.set(".key-link-item", {
        opacity: 0,
        x: -60,
        scale: 0.9,
      });
      gsap.set(".read-more-btn", { opacity: 0, y: 30 });

      // Main timeline
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 75%",
          end: "bottom 25%",
          toggleActions: "play none none reverse",
        },
      });

      // Container entrance
      mainTl
        .to(".welcome-container", {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })

        // Badge with spin and scale
        .to(
          ".welcome-badge",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.8",
        )

        // Title with skew correction
        .to(
          ".welcome-title",
          {
            opacity: 1,
            y: 0,
            skewX: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.6",
        )

        // Content sections with stagger
        .to(
          ".welcome-content",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            stagger: 0.3,
            ease: "power2.out",
          },
          "-=0.8",
        )

        // Carousel with 3D flip
        .to(
          ".carousel-container",
          {
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 1.5,
            ease: "back.out(1.3)",
          },
          "-=1.2",
        )

        // Key links with wave effect
        .to(
          ".key-link-item",
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
          "-=1",
        )

        // Read more button
        .to(
          ".read-more-btn",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=0.4",
        );

      // Floating animations
      gsap.to(".welcome-badge", {
        y: -10,
        rotation: 5,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 2,
      });

      // Parallax effects
      gsap.to(".welcome-content", {
        y: (i) => -20 * (i + 1),
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

  // Link hover animations
  const handleLinkHover = (index: number, isEntering: boolean) => {
    setHoveredLink(isEntering ? index : null);

    const item = container.current?.querySelector(`.key-link-${index}`);
    if (!item) return;

    gsap.to(item, {
      scale: isEntering ? 1.05 : 1,
      x: isEntering ? 8 : 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Icon animation
    gsap.to(item.querySelector(".link-icon"), {
      scale: isEntering ? 1.2 : 1,
      rotation: isEntering ? 10 : 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    });
  };

  return (
    <section
      ref={container}
      className="welcome-container relative bg-gradient-to-b from-background via-accent/30 to-background py-16 md:py-24 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/3 to-blue-500/3 rounded-full blur-3xl" />
      </div>

      <PublicMainContainer className="relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Welcome Message Section */}
          <div className="lg:col-span-5 welcome-content">
            <div className="welcome-badge inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full border border-primary/20 mb-6">
              <Quote className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Welcome Message
              </span>
            </div>

            <h2 className="welcome-title text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Welcome to Excellence
            </h2>

            <div className="space-y-6 mb-8">
              <p className="text-lg leading-relaxed text-muted-foreground">
                Welcome to{" "}
                <span className="font-semibold text-foreground">
                  Presbyterian Senior High Technical School (NPRESEC)
                </span>
                , a premier government assisted senior high school of the North
                East Region of Ghana established at Nakpanduri in the
                Bunkprugu-Nakpanduri District.
              </p>

              <p className="leading-relaxed text-muted-foreground">
                We are dedicated to the well-being and success of our students,
                providing them with extraordinary experiences and networks that
                allow them to grow and develop into future leaders, innovators,
                and responsible citizens.
              </p>

              <div className="p-4 bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-lg border border-primary/10">
                <p className="text-sm font-medium text-primary mb-2">
                  Our Mission
                </p>
                <p className="text-sm text-muted-foreground">
                  To provide quality education that nurtures academic
                  excellence, character development, and practical skills for
                  holistic growth.
                </p>
              </div>
            </div>

            <Link
              href="/about"
              className={`read-more-btn group inline-flex items-center gap-2 ${buttonVariants(
                {
                  variant: "outline",
                  size: "lg",
                  className:
                    "hover:bg-primary hover:text-primary-foreground transition-all duration-300",
                },
              )}`}
            >
              <span className="group-hover:tracking-wider transition-all duration-300">
                Read More
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>

          {/* Carousel Section */}
          <div className="lg:col-span-4 welcome-content flex justify-center lg:justify-start">
            <div className="carousel-container relative max-w-sm w-full">
              <div className="relative">
                <CarouselComponent images={CarouselImages} />
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary/20 rounded-full animate-pulse" />
                <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-orange-500/20 rounded-full animate-pulse delay-1000" />
              </div>
            </div>
          </div>

          {/* Key Links Section */}
          <div className="lg:col-span-3 welcome-content">
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-500/20 mb-4">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-500">
                  Quick Access
                </span>
              </div>
              <h3 className="welcome-title text-2xl font-bold text-foreground">
                Key Links
              </h3>
            </div>

            <div className="space-y-3">
              {keyLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.name}
                    className={`key-link-item key-link-${index} group relative`}
                  >
                    <Link
                      href={link.href as Route}
                      className={`block p-4 rounded-xl ${link.bgColor} border border-border/30 hover:border-current transition-all duration-300`}
                      onMouseEnter={() => handleLinkHover(index, true)}
                      onMouseLeave={() => handleLinkHover(index, false)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`link-icon p-2 rounded-lg bg-gradient-to-br ${link.color} text-white transition-transform duration-300`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                            {link.name}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground transition-colors duration-300">
                            {link.description}
                          </p>
                        </div>

                        <ChevronRight
                          className={`w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1`}
                        />
                      </div>

                      {/* Hover overlay */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${link.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-500`}
                      />
                    </Link>

                    {index < keyLinks.length - 1 && (
                      <Separator className="mt-3 opacity-30" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Additional CTA */}
            <div className="mt-8 p-4 bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-lg border border-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary text-sm">
                    Need Help?
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Contact our support team
                  </p>
                </div>
                <Link
                  href={"/contact" as Route}
                  className={buttonVariants({
                    size: "sm",
                    variant: "outline",
                    className: "text-xs",
                  })}
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>
      </PublicMainContainer>
    </section>
  );
};
