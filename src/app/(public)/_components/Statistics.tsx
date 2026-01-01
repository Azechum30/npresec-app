"use client";

import { useRef, useState, useEffect } from "react";
import { PublicMainContainer } from "./PublicMainContainer";
import Image from "next/image";
import PencilsBackground from "@/../public/Pencils.jpg";
import { CountUpComponent } from "@/components/customComponents/CountUpComponent";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  Users,
  BookOpen,
  GraduationCap,
  Award,
  TrendingUp,
  Sparkles,
  Star,
} from "lucide-react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const statistics = [
  {
    id: "inauguration",
    value: 2012,
    label: "School Inauguration",
    icon: Calendar,
    description: "Year of establishment",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-500/10",
    suffix: "",
    animationDelay: 0,
  },
  {
    id: "students",
    value: 600,
    label: "Students Enrolled",
    icon: Users,
    description: "Active student body",
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-500/10",
    suffix: "+",
    animationDelay: 0.2,
  },
  {
    id: "programs",
    value: 6,
    label: "Learning Areas",
    icon: BookOpen,
    description: "Diverse academic programs",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-500/10",
    suffix: "+",
    animationDelay: 0.4,
  },
  {
    id: "staff",
    value: 50,
    label: "Teaching Staff",
    icon: GraduationCap,
    description: "Dedicated educators",
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-500/10",
    suffix: "+",
    animationDelay: 0.6,
  },
];

export const Statistics = () => {
  const container = useRef<HTMLDivElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredStat, setHoveredStat] = useState<string | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".stats-container", { opacity: 0, y: 100 });
      gsap.set(".stats-background", { scale: 1.2, opacity: 0 });
      gsap.set(".stats-overlay", { opacity: 0 });
      gsap.set(".stats-badge", { opacity: 0, scale: 0.3, rotation: -180 });
      gsap.set(".stats-title", { opacity: 0, y: 80, skewY: 15 });
      gsap.set(".stats-subtitle", {
        opacity: 0,
        y: 40,
        clipPath: "inset(100% 0 0 0)",
      });
      gsap.set(".stat-card", {
        opacity: 0,
        y: 120,
        scale: 0.7,
        rotationX: 60,
        transformOrigin: "center bottom",
      });
      gsap.set(".stat-icon", { opacity: 0, scale: 0.3, rotation: -90 });
      gsap.set(".stat-number", { opacity: 0, scale: 1.5 });
      gsap.set(".stat-label", { opacity: 0, y: 20 });
      gsap.set(".stat-description", { opacity: 0, x: -30 });
      gsap.set(".floating-elements", { opacity: 0, scale: 0 });

      // Main timeline with ScrollTrigger
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
          onToggle: (self) => {
            setIsVisible(self.isActive);
          },
        },
      });

      // Background and container entrance
      mainTl
        .to(".stats-background", {
          opacity: 1,
          scale: 1,
          duration: 2,
          ease: "power2.out",
        })
        .to(
          ".stats-overlay",
          {
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          "-=1.5",
        )
        .to(
          ".stats-container",
          {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power3.out",
          },
          "-=1",
        )

        // Badge with spin entrance
        .to(
          ".stats-badge",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1.2,
            ease: "back.out(1.7)",
          },
          "-=1.2",
        )

        // Title with skew correction
        .to(
          ".stats-title",
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1.5,
            ease: "power2.out",
          },
          "-=0.8",
        )

        // Subtitle with clip-path reveal
        .to(
          ".stats-subtitle",
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.6",
        )

        // Stat cards with 3D flip
        .to(
          ".stat-card",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 1.5,
            stagger: {
              amount: 0.8,
              from: "start",
              ease: "power2.out",
            },
            ease: "back.out(1.3)",
          },
          "-=0.8",
        )

        // Icons with rotation and scale
        .to(
          ".stat-icon",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=1.2",
        )

        // Numbers with scale effect
        .to(
          ".stat-number",
          {
            opacity: 1,
            scale: 1,
            duration: 1.2,
            stagger: 0.2,
            ease: "back.out(1.4)",
          },
          "-=0.8",
        )

        // Labels and descriptions
        .to(
          ".stat-label",
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .to(
          ".stat-description",
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.4",
        )

        // Floating decorative elements
        .to(
          ".floating-elements",
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.7)",
          },
          "-=0.6",
        );

      // Continuous animations
      if (typeof window !== "undefined") {
        // Parallax effect for background
        gsap.to(".stats-background", {
          yPercent: -30,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });

        // Floating badge animation
        gsap.to(".stats-badge", {
          y: -12,
          rotation: 8,
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 3,
        });

        // Floating decorative elements
        gsap.to(".floating-star-1", {
          y: -20,
          x: 10,
          rotation: 360,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        });

        gsap.to(".floating-star-2", {
          y: -15,
          x: -8,
          rotation: -360,
          duration: 6,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 1,
        });

        gsap.to(".floating-sparkle", {
          scale: 1.3,
          opacity: 0.8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
          delay: 2,
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      };
    },
    { scope: container },
  );

  // Card hover animations
  const handleCardHover = (id: string, isEntering: boolean) => {
    setHoveredStat(isEntering ? id : null);

    const card = container.current?.querySelector(`.stat-card-${id}`);
    if (!card) return;

    gsap.to(card, {
      scale: isEntering ? 1.08 : 1,
      y: isEntering ? -15 : 0,
      rotationY: isEntering ? 8 : 0,
      duration: 0.4,
      ease: "power2.out",
    });

    // Enhanced glow effect
    gsap.to(card.querySelector(".stat-glow"), {
      opacity: isEntering ? 0.6 : 0,
      scale: isEntering ? 1.2 : 1,
      duration: 0.5,
      ease: "power2.out",
    });

    // Icon bounce
    gsap.to(card.querySelector(".stat-icon"), {
      scale: isEntering ? 1.3 : 1,
      rotation: isEntering ? 15 : 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    });

    // Number pulse
    gsap.to(card.querySelector(".stat-number"), {
      scale: isEntering ? 1.1 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <div
      ref={container}
      className="relative w-full py-16 md:py-24 overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div ref={backgroundRef} className="absolute inset-0">
        <div className="stats-background absolute inset-0">
          <Image
            src={PencilsBackground}
            alt="Educational background with pencils"
            className="w-full h-full object-cover object-center"
            priority={false}
            quality={75}
          />
        </div>

        {/* Enhanced Gradient Overlay */}
        <div className="stats-overlay absolute inset-0 bg-gradient-to-br from-background/85 via-primary/20 to-background/90 dark:from-background/90 dark:via-background/95 dark:to-background/95" />

        {/* Mesh Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-orange-500/5" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="floating-elements absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-star-1 absolute top-20 left-[10%] w-6 h-6 text-primary/30">
          <Star className="w-full h-full" fill="currentColor" />
        </div>
        <div className="floating-star-2 absolute top-32 right-[15%] w-4 h-4 text-orange-500/40">
          <Star className="w-full h-full" fill="currentColor" />
        </div>
        <div className="floating-sparkle absolute bottom-32 left-[20%] w-8 h-8 text-pink-500/30">
          <Sparkles className="w-full h-full" />
        </div>
        <div className="floating-star-1 absolute bottom-20 right-[25%] w-5 h-5 text-blue-500/40">
          <Star className="w-full h-full" fill="currentColor" />
        </div>
      </div>

      {/* Main Content */}
      <PublicMainContainer className="relative z-10">
        <div className="stats-container">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="stats-badge inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/15 to-orange-500/15 backdrop-blur-sm rounded-full border border-primary/30 mb-8 shadow-lg">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary tracking-wider">
                OUR ACHIEVEMENTS
              </span>
            </div>

            <h2 className="stats-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent">
              Numbers That Inspire
            </h2>

            <p className="stats-subtitle text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              More than a decade of educational excellence, nurturing minds and
              shaping futures in the heart of Ghana&apos;s North East Region.
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {statistics.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`stat-card stat-card-${stat.id} group relative cursor-pointer`}
                  onMouseEnter={() => handleCardHover(stat.id, true)}
                  onMouseLeave={() => handleCardHover(stat.id, false)}
                >
                  {/* Card Background */}
                  <div className="relative p-8 bg-white/90 dark:bg-background/90 backdrop-blur-sm rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-500 overflow-hidden">
                    {/* Animated Glow Effect */}
                    <div
                      className={`stat-glow absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 rounded-2xl blur-xl`}
                    />

                    {/* Top Accent */}
                    <div
                      className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-t-2xl`}
                    />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon Container */}
                      <div
                        className={`stat-icon-container inline-flex p-4 rounded-2xl ${stat.bgColor} mb-6 relative overflow-hidden`}
                      >
                        <div
                          className={`stat-icon w-8 h-8 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center text-white shadow-lg`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>

                        {/* Icon Background Effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 rounded-2xl`}
                        />
                      </div>

                      {/* Number */}
                      <div className="stat-number text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        <CountUpComponent countTo={stat.value} />
                        <span className="text-2xl md:text-3xl ml-1 opacity-80">
                          {stat.suffix}
                        </span>
                      </div>

                      {/* Label */}
                      <h3 className="stat-label text-lg font-bold mb-2 text-foreground">
                        {stat.label}
                      </h3>

                      {/* Description */}
                      <p className="stat-description text-sm text-muted-foreground">
                        {stat.description}
                      </p>
                    </div>

                    {/* Decorative Corner Element */}
                    <div
                      className={`absolute top-4 right-4 w-3 h-3 bg-gradient-to-br ${stat.color} rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-300`}
                    />

                    {/* Bottom Shine Effect */}
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
                  </div>

                  {/* External Glow */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl blur-2xl transition-opacity duration-500 -z-10`}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-background/80 to-accent/60 backdrop-blur-sm rounded-full border border-border/50">
              <Award className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Building Excellence Since 2012
              </span>
            </div>
          </div>
        </div>
      </PublicMainContainer>
    </div>
  );
};
