"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Crown, Shield, Star } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface BoardHighlight {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  gradient: string;
  bgColor: string;
}

const boardHighlights = [
  {
    icon: Crown,
    title: "Leadership Excellence",
    description: "Experienced leaders guiding our institution",
    gradient: "from-yellow-500 to-orange-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
  },
  {
    icon: Shield,
    title: "Strategic Oversight",
    description: "Ensuring educational quality and institutional growth",
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    icon: Star,
    title: "Community Impact",
    description: "Connecting school with broader community needs",
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
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
      <div className="floating-decoration floating-element parallax-bg absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl" />
      <div className="floating-decoration floating-element parallax-bg absolute top-1/3 -left-32 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
      <div className="floating-decoration floating-element parallax-bg absolute bottom-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-2xl" />

      <div className="flex flex-col gap-16">
        {/* Header Section */}
        <div className="text-center">
          {/* Badge */}
          <div className="board-badge flex justify-center mb-8">
            <Badge
              variant="secondary"
              className="px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md border-primary/20 text-primary hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 text-lg"
            >
              <Users className="w-5 h-5 mr-2" />
              Leadership & Governance
            </Badge>
          </div>

          {/* Main Header */}
          <div className="board-header mb-8">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Board of Governors
              </h1>
            </div>
            <div className="h-1 w-32 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto" />
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
            <p className="text-base text-muted-foreground">
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
                onMouseLeave={() => setHoveredHighlight(null)}
              >
                {/* Gradient background overlay */}
                <div
                  className={`
                    absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500
                    ${highlight.gradient}
                    ${isHovered ? "opacity-5" : "opacity-0"}
                  `}
                />

                {/* Decorative corner */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardContent className="relative p-6 text-center">
                  {/* Icon */}
                  <div
                    className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all duration-300
                      ${
                        isHovered
                          ? `bg-gradient-to-br ${highlight.gradient} text-white shadow-lg scale-110`
                          : `${highlight.bgColor} text-muted-foreground`
                      }
                    `}
                  >
                    <Icon className="w-8 h-8" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {highlight.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
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
