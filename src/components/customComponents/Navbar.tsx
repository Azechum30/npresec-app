"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Logo from "@/../public/logo.png";
import { ThemeSwitcher } from "./ThemeSwitecher";
import { Button, buttonVariants } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  LogIn,
  Sparkles,
  ArrowRight,
  Home,
  Users,
  GraduationCap,
  Zap,
} from "lucide-react";
import { TriggerMobileNavbar } from "./TriggerMobileNavbar";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

type NavigationLinksProps = {
  href: string;
  title: string;
  icon: React.ComponentType<any>;
  description: string;
  gradient: string;
};

export const Links: NavigationLinksProps[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Welcome to NPRESEC",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "About",
    href: "/about",
    icon: Users,
    description: "Our story and values",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Admissions",
    href: "/admissions",
    icon: GraduationCap,
    description: "Join our community",
    gradient: "from-purple-500 to-pink-500",
  },
];

export type AuthUserType = {
  id?: string;
  email?: string;
  username?: string;
  image?: string | null;
};

export default function Navbar() {
  const container = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".navbar-brand", { opacity: 0, x: -50, scale: 0.8 });
      gsap.set(".navbar-link", { opacity: 0, y: -30, scale: 0.9 });
      gsap.set(".navbar-actions", { opacity: 0, x: 50, scale: 0.8 });
      gsap.set(".navbar-decoration", {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });

      // Create entrance timeline
      const entranceTl = gsap.timeline({
        delay: 0.2,
        onComplete: () => setIsLoaded(true),
      });

      entranceTl
        .to(".navbar-brand", {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .to(
          ".navbar-link",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
          "-=0.5",
        )
        .to(
          ".navbar-actions",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            ease: "back.out(1.7)",
          },
          "-=0.4",
        )
        .to(
          ".navbar-decoration",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "elastic.out(1, 0.5)",
          },
          "-=0.3",
        );

      // Floating animation for decorations
      gsap.to(".floating-navbar-decoration", {
        y: -10,
        rotation: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });

      // Navbar transform on scroll
      ScrollTrigger.create({
        trigger: "body",
        start: "top -20px",
        end: "bottom top",
        onUpdate: (self) => {
          if (self.direction === 1) {
            // Scrolling down
            gsap.to(container.current, {
              y: 0,
              backdropFilter: "blur(20px)",
              backgroundColor: "rgba(var(--background), 0.8)",
              duration: 0.3,
            });
          }
        },
      });
    },
    { scope: container },
  );

  const isCurrentPath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Background decorations */}
      <div className="navbar-decoration floating-navbar-decoration fixed top-4 right-20 w-3 h-3 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-sm pointer-events-none z-40" />
      <div className="navbar-decoration floating-navbar-decoration fixed top-8 left-1/4 w-2 h-2 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-sm pointer-events-none z-40" />

      <header
        ref={container}
        className={`
          sticky top-0 z-50 transition-all duration-300 border-b
          ${
            isScrolled
              ? "bg-background/80 backdrop-blur-2xl border-border/50 shadow-lg"
              : "bg-background/95 backdrop-blur-md border-border/30"
          }
        `}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-50" />

        {/* Sparkle decoration */}
        <div className="navbar-decoration absolute top-3 left-1/2 transform -translate-x-1/2">
          <Sparkles className="w-4 h-4 text-primary/20" />
        </div>

        <div className="relative container mx-auto flex min-h-16 items-center px-4 md:px-6 lg:px-8 py-2">
          {/* Brand Logo */}
          <Link
            href={"/" as Route}
            className="navbar-brand flex items-center gap-3 mr-6"
          >
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative flex items-center justify-center p-2 bg-gradient-to-br from-background to-accent/30 border border-border/50 rounded-xl shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <Image
                  src={Logo}
                  alt="NPRESEC Logo"
                  width={50}
                  height={50}
                  className="size-16 object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PresbySHTS
              </span>
              {/*<span className="text-xs text-muted-foreground hidden sm:block">
                Excellence in Education
              </span>*/}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex lg:justify-between lg:items-center w-full">
            <div className="flex items-center space-x-1">
              {Links.map((link, index) => {
                const Icon = link.icon;
                const isCurrent = isCurrentPath(link.href);
                const isHovered = hoveredLink === index;

                return (
                  <div key={link.title} className="relative group">
                    <Link
                      href={link.href as Route}
                      className={`
                        navbar-link relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium text-sm
                        ${
                          isCurrent
                            ? "text-primary bg-primary/10 shadow-md"
                            : "text-muted-foreground hover:text-primary hover:bg-accent/50"
                        }
                      `}
                      onMouseEnter={() => setHoveredLink(index)}
                      onMouseLeave={() => setHoveredLink(null)}
                    >
                      {/* Gradient background on hover */}
                      <div
                        className={`
                          absolute inset-0 bg-gradient-to-r opacity-0 rounded-xl transition-opacity duration-300
                          ${link.gradient}
                          ${isHovered ? "opacity-5" : "opacity-0"}
                        `}
                      />

                      {/* Active indicator */}
                      {isCurrent && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
                      )}

                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">{link.title}</span>

                      {/* Hover tooltip */}
                      <div
                        className={`
                          absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-background/90 backdrop-blur-md border border-border/50 rounded-lg shadow-lg opacity-0 pointer-events-none transition-opacity duration-300
                          ${isHovered ? "opacity-100" : "opacity-0"}
                        `}
                      >
                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                          {link.description}
                        </p>
                        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-background border-l border-t border-border/50 rotate-45" />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Desktop Actions */}
            <div className="navbar-actions flex items-center space-x-3">
              <div className="relative">
                <ThemeSwitcher />
              </div>

              <div className="flex items-center space-x-2">
                <Link
                  href={"/" as Route}
                  className={`
                    group relative overflow-hidden px-6 py-2 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium text-sm
                  `}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  <span className="relative flex items-center gap-2">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </Link>

                <Link
                  href={"/sign-in" as Route}
                  className={`
                    group relative px-6 py-2 border border-border/50 rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-md font-medium text-sm hover:bg-accent/50
                  `}
                >
                  <span className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                    Login
                  </span>
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile Navigation Trigger */}
          <div className="lg:hidden flex items-center space-x-3 ml-auto">
            <ThemeSwitcher />
            <div className="navbar-actions">
              <TriggerMobileNavbar />
            </div>
          </div>
        </div>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </header>
    </>
  );
}
