/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Crown, Shield, Star, Users } from "lucide-react";
import { useRef, useState } from "react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const boardHighlights = [
  {
    icon: Crown,
    title: "Leadership Excellence",
    description: "Experienced leaders guiding our institution",
    gradient: "from-primary to-secondary",
    bgColor: "bg-primary/10 dark:bg-primary/20",
  },
  {
    icon: Shield,
    title: "Strategic Oversight",
    description: "Ensuring educational quality and institutional growth",
    gradient: "from-secondary to-accent",
    bgColor: "bg-secondary/10 dark:bg-secondary/20",
  },
  {
    icon: Star,
    title: "Community Impact",
    description: "Connecting school with broader community needs",
    gradient: "from-primary to-accent",
    bgColor: "bg-accent/20 dark:bg-accent/30",
  },
];

interface BoardOfGovernorsClientProps {
  children: React.ReactNode;
}

export function BoardOfGovernorsClient({
  children,
}: BoardOfGovernorsClientProps) {
  const container = useRef<HTMLDivElement>(null);
  const [hoveredHighlight, setHoveredHighlight] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".board-badge", { opacity: 0, y: 50, scale: 0.8 });
      gsap.set(".board-header", { opacity: 0, y: 60, rotationX: 45 });
      gsap.set(".board-description", {
        opacity: 0,
        y: 40,
        clipPath: "inset(100% 0 0 0)",
      });
      gsap.set(".board-highlight", {
        opacity: 0,
        y: 80,
        scale: 0.9,
        rotationY: 45,
      });
      gsap.set(".board-members-section", { opacity: 0, y: 100 });
      gsap.set(".floating-decoration", {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });

      // Main entrance timeline
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      mainTl
        .to(".board-badge", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .to(
          ".board-header",
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.5",
        )
        .to(
          ".board-description",
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          ".board-highlight",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "back.out(1.2)",
          },
          "-=0.4",
        );

      // Board members section animation
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".board-members-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .to(".board-members-section", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });

      // Floating decorations
      gsap.to(".floating-decoration", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5,
      });

      // Continuous floating animation
      gsap.to(".floating-element", {
        y: -20,
        rotation: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.8,
      });

      // Parallax effect for background elements
      gsap.to(".parallax-bg", {
        yPercent: -30,
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
    <div ref={container} className="relative overflow-hidden">
      {/* Background decorations */}
      <div className="floating-decoration floating-element parallax-bg absolute -top-20 -right-20 w-40 h-40 bg-linear-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl" />
      <div className="floating-decoration floating-element parallax-bg absolute top-1/3 -left-32 w-64 h-64 bg-linear-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
      <div className="floating-decoration floating-element parallax-bg absolute bottom-1/4 right-1/4 w-32 h-32 bg-linear-to-br from-secondary/10 to-accent/10 rounded-full blur-2xl" />

      <div className="flex flex-col gap-16 border rounded-xl p-4">
        {/* Header Section */}
        <div className="text-center">
          {/* Badge */}
          <div className="board-badge flex justify-center mb-8">
            <Badge
              variant="secondary"
              className="px-6 py-3 bg-linear-to-r from-primary/10 to-muted-foreground/10 dark:to-accent/10 backdrop-blur-md border-primary/20 text-primary hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 text-lg">
              <Users className="w-5 h-5 mr-2" />
              Leadership & Governance
            </Badge>
          </div>

          {/* Main Header */}
          <div className="board-header mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-linear-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-primary to-muted-foreground dark:to-accent bg-clip-text text-transparent">
                Board of Governors
              </h1>
            </div>
            <div className="h-1 w-32 bg-linear-to-r from-primary to-secondary rounded-full mx-auto" />
          </div>

          {/* Description */}
          <div className="board-description max-w-4xl mx-auto">
            <p className="text-lg md:text-xl leading-relaxed text-foreground/80 mb-8">
              The governance and strategic oversight of Nakpanduri Presbyterian
              Senior High Technical School (NPRESEC) is entrusted to a dedicated
              Board of Governors, composed of key stakeholders who bring diverse
              expertise, spiritual guidance, and community representation to the
              institution.
            </p>
            <p className="text-base text-foreground/70">
              Discover their individual contributions and expertise by exploring
              each member&apos;s detailed profile below.
            </p>
          </div>
        </div>

        {/* Board Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {boardHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            const isHovered = hoveredHighlight === index;

            return (
              <Card
                key={highlight.title}
                className="board-highlight group cursor-default relative overflow-hidden bg-background/60 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
                onMouseEnter={() => setHoveredHighlight(index)}
                onMouseLeave={() => setHoveredHighlight(null)}>
                {/* Gradient background overlay */}
                <div
                  className={`
                    absolute inset-0 bg-linear-to-br opacity-0 transition-opacity duration-500
                    ${highlight.gradient}
                    ${isHovered ? "opacity-5" : "opacity-0"}
                  `}
                />

                {/* Decorative corner */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-linear-to-br from-primary/10 to-secondary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="relative p-6 text-center">
                  {/* Icon */}
                  <div
                    className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300
                      ${
                        isHovered
                          ? `bg-linear-to-br ${highlight.gradient} text-white shadow-lg scale-110`
                          : `${highlight.bgColor} text-foreground/70`
                      }
                    `}>
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {highlight.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Children (Board Members Section and CTA) */}
        {children}
      </div>
    </div>
  );
}
