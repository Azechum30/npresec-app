"use client";

import { useRef, useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Eye,
  Heart,
  Users,
  Music,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface SidebarLink {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  gradient: string;
}

const SidebarLinks: SidebarLink[] = [
  {
    name: "Brief History",
    href: "/about",
    icon: BookOpen,
    description: "Our journey and heritage",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    name: "Our Vision & Mission",
    href: "/about/vision-mission",
    icon: Eye,
    description: "Our purpose and direction",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    name: "Core Values",
    href: "/about/core-values",
    icon: Heart,
    description: "What guides us daily",
    gradient: "from-red-500 to-orange-500",
  },
  {
    name: "Board of Governors",
    href: "/about/board-of-governors",
    icon: Users,
    description: "Leadership and governance",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    name: "School Anthem",
    href: "/about/school-anthem",
    icon: Music,
    description: "Our song of unity",
    gradient: "from-indigo-500 to-purple-500",
  },
];

export const AboutSidebar = () => {
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".sidebar-container", {
        opacity: 0,
        y: 50,
        scale: 0.95,
      });
      gsap.set(".sidebar-header", {
        opacity: 0,
        x: -30,
      });
      gsap.set(".sidebar-link", {
        opacity: 0,
        x: -40,
        scale: 0.9,
      });
      gsap.set(".sidebar-decoration", {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });

      // Create entrance timeline
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      entranceTl
        .to(".sidebar-container", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(
          ".sidebar-header",
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.5",
        )
        .to(
          ".sidebar-link",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        )
        .to(
          ".sidebar-decoration",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.4",
        );

      // Floating animation for decorations
      gsap.to(".floating-sidebar-decoration", {
        y: -10,
        rotation: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
      });
    },
    { scope: container },
  );

  const currentPath = pathname.split("/").pop();

  return (
    <div ref={container} className="sticky top-20 z-30">
      <Card className="sidebar-container relative overflow-hidden bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl">
        {/* Background decorations */}
        <div className="sidebar-decoration floating-sidebar-decoration absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-sm" />
        <div className="sidebar-decoration floating-sidebar-decoration absolute -bottom-2 -left-2 w-8 h-8 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-sm" />

        {/* Sparkle decoration */}
        <div className="sidebar-decoration absolute top-4 right-4">
          <Sparkles className="w-5 h-5 text-primary/30" />
        </div>

        <CardContent className="p-6">
          {/* Header */}
          <div className="sidebar-header mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Explore
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Learn more about our school
            </p>
          </div>

          <Separator className="mb-6 bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            {SidebarLinks.map((link, index) => {
              const isActive = currentPath === link.href.split("/").pop();
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href as Route}
                  className="sidebar-link group relative block"
                  onMouseEnter={() => setHoveredLink(index)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  <div
                    className={`
                      relative p-4 rounded-xl transition-all duration-300 overflow-hidden
                      ${
                        isActive
                          ? "bg-primary/10 border-2 border-primary/20 shadow-lg"
                          : "bg-transparent border-2 border-transparent hover:bg-accent/50 hover:border-accent/30"
                      }
                    `}
                  >
                    {/* Gradient background on hover */}
                    <div
                      className={`
                        absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300
                        ${link.gradient}
                        ${hoveredLink === index ? "opacity-5" : "opacity-0"}
                      `}
                    />

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                    )}

                    <div className="relative flex items-start gap-3">
                      {/* Icon */}
                      <div
                        className={`
                          flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300
                          ${
                            isActive
                              ? `bg-gradient-to-br ${link.gradient} text-white shadow-md`
                              : "bg-accent/80 text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
                          }
                        `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4
                            className={`
                              font-medium text-sm transition-colors duration-300
                              ${
                                isActive
                                  ? "text-primary font-semibold"
                                  : "text-foreground group-hover:text-primary"
                              }
                            `}
                          >
                            {link.name}
                          </h4>
                          <ChevronRight
                            className={`
                              w-4 h-4 transition-all duration-300
                              ${
                                isActive
                                  ? "text-primary translate-x-1"
                                  : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                              }
                            `}
                          />
                        </div>
                        <p
                          className={`
                            text-xs transition-colors duration-300
                            ${
                              isActive
                                ? "text-primary/70"
                                : "text-muted-foreground group-hover:text-foreground/70"
                            }
                          `}
                        >
                          {link.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="sidebar-header mt-6 pt-4">
            <Separator className="mb-4 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="bg-gradient-to-br from-accent/30 to-primary/10 rounded-xl p-4 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium">Quick Tip</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Navigate through our sections to discover the complete story of
                NPRESEC.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
