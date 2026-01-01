"use client";

import { useRef, useState } from "react";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Button, buttonVariants } from "../ui/button";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/../public/logo.png";
import { Links } from "./Navbar";
import { ThemeSwitcher } from "./ThemeSwitecher";
import {
  LogIn,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Home,
  X,
  ChevronRight,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(useGSAP);

export const MobileNavbar = () => {
  const { onClose, dialogs } = useGenericDialog();
  const container = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);
  const isOpen = dialogs["mobile-nav"];

  const isCurrentPath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  useGSAP(
    () => {
      if (!container.current || !isOpen) return;

      // Set initial states
      gsap.set(".mobile-nav-header", { opacity: 0, y: -30 });
      gsap.set(".mobile-nav-link", { opacity: 0, x: -40, scale: 0.9 });
      gsap.set(".mobile-nav-actions", { opacity: 0, y: 30 });
      gsap.set(".mobile-nav-decoration", {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });
      gsap.set(".mobile-nav-brand", { opacity: 0, scale: 0.8 });

      // Create entrance timeline
      const entranceTl = gsap.timeline({ delay: 0.1 });

      entranceTl
        .to(".mobile-nav-header", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .to(
          ".mobile-nav-brand",
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        )
        .to(
          ".mobile-nav-link",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
          "-=0.2",
        )
        .to(
          ".mobile-nav-actions",
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          ".mobile-nav-decoration",
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
      gsap.to(".floating-mobile-decoration", {
        y: -10,
        rotation: 10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
      });
    },
    { scope: container, dependencies: [isOpen] },
  );

  const handleLinkClick = () => {
    // Add exit animation before closing
    gsap.to(".mobile-nav-content > *", {
      opacity: 0,
      x: -20,
      duration: 0.2,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => onClose("mobile-nav"),
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={() => onClose("mobile-nav")}>
      <SheetContent
        side="left"
        className="w-full sm:w-96 p-0 bg-background/95 backdrop-blur-2xl border-r border-border/50"
      >
        <div
          ref={container}
          className="mobile-nav-content relative h-full overflow-hidden"
        >
          {/* Background decorations */}
          <div className="mobile-nav-decoration floating-mobile-decoration absolute top-20 right-8 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl" />
          <div className="mobile-nav-decoration floating-mobile-decoration absolute bottom-1/3 left-4 w-12 h-12 bg-gradient-to-br from-accent/15 to-primary/15 rounded-full blur-lg" />
          <div className="mobile-nav-decoration floating-mobile-decoration absolute top-1/2 right-6 w-8 h-8 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-full blur-md" />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/95 pointer-events-none" />

          {/* Header */}
          <SheetHeader className="mobile-nav-header relative p-6 pb-4 border-b border-border/30 bg-gradient-to-r from-primary/5 to-secondary/5">
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onClose("mobile-nav")}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-background/80"
            >
              <X className="w-4 h-4" />
            </Button>

            <div className="mobile-nav-brand flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-md" />
                <div className="relative flex items-center justify-center p-2 bg-background border border-border/50 rounded-xl shadow-sm">
                  <Image
                    src={Logo}
                    alt="NPRESEC Logo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
              </div>
              <div>
                <SheetTitle className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  PresbySHTS
                </SheetTitle>
                <SheetDescription className="text-xs text-muted-foreground">
                  Excellence in Education
                </SheetDescription>
              </div>
            </div>

            <Badge
              variant="secondary"
              className="w-fit bg-primary/10 text-primary border-primary/20"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Navigation Menu
            </Badge>
          </SheetHeader>

          {/* Main Navigation */}
          <nav className="flex flex-col justify-between h-full">
            <div className="flex-1 p-6 space-y-3">
              {Links.map((link, index) => {
                const Icon = link.icon;
                const isCurrent = isCurrentPath(link.href);
                const isHovered = hoveredLink === index;

                return (
                  <div key={link.href} className="mobile-nav-link">
                    <Link
                      href={link.href as Route}
                      onClick={handleLinkClick}
                      onMouseEnter={() => setHoveredLink(index)}
                      onMouseLeave={() => setHoveredLink(null)}
                      className={`
                        group relative block p-4 rounded-2xl transition-all duration-300 overflow-hidden
                        ${
                          isCurrent
                            ? "bg-primary/10 border-2 border-primary/20 shadow-lg"
                            : "bg-background/60 border-2 border-transparent hover:bg-accent/50 hover:border-accent/30"
                        }
                      `}
                    >
                      {/* Gradient background on hover */}
                      <div
                        className={`
                          absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 rounded-2xl
                          ${link.gradient}
                          ${isHovered ? "opacity-5" : "opacity-0"}
                        `}
                      />

                      {/* Active indicator */}
                      {isCurrent && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-r-full" />
                      )}

                      <div className="relative flex items-center gap-4">
                        {/* Icon */}
                        <div
                          className={`
                            flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                            ${
                              isCurrent
                                ? `bg-gradient-to-br ${link.gradient} text-white shadow-md`
                                : "bg-accent/80 text-muted-foreground group-hover:bg-accent group-hover:text-foreground"
                            }
                          `}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3
                              className={`
                                font-semibold text-base transition-colors duration-300
                                ${
                                  isCurrent
                                    ? "text-primary"
                                    : "text-foreground group-hover:text-primary"
                                }
                              `}
                            >
                              {link.title}
                            </h3>
                            <ChevronRight
                              className={`
                                w-4 h-4 transition-all duration-300
                                ${
                                  isCurrent
                                    ? "text-primary translate-x-1"
                                    : "text-muted-foreground group-hover:text-primary group-hover:translate-x-1"
                                }
                              `}
                            />
                          </div>
                          <p
                            className={`
                              text-sm transition-colors duration-300
                              ${
                                isCurrent
                                  ? "text-primary/70"
                                  : "text-muted-foreground group-hover:text-foreground/70"
                              }
                            `}
                          >
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Actions Footer */}
            <div className="mobile-nav-actions p-6 border-t border-border/30 bg-gradient-to-r from-background/50 to-accent/10 backdrop-blur-sm">
              <div className="space-y-4">
                {/* Theme Switcher */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-background/60 border border-border/50">
                  <span className="text-sm font-medium text-foreground">
                    Theme
                  </span>
                  <ThemeSwitcher />
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    href={"/" as Route}
                    onClick={handleLinkClick}
                    className="group relative block w-full"
                  >
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 text-base font-semibold rounded-xl">
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-xl" />
                      <span className="relative flex items-center justify-center gap-2">
                        Get Started
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </span>
                    </Button>
                  </Link>

                  <Link
                    href={"/sign-in" as Route}
                    onClick={handleLinkClick}
                    className="block w-full"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-border/50 rounded-xl hover:border-primary/30 transition-all duration-300 hover:shadow-md h-12 text-base font-medium hover:bg-accent/50"
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                </div>

                {/* Footer note */}
                <div className="pt-3 border-t border-border/20">
                  <p className="text-xs text-muted-foreground text-center">
                    Nakpanduri Presbyterian Senior High Technical School
                  </p>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
