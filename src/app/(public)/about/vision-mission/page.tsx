"use client";

import { useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Target,
  Heart,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Shield,
  Users,
  BookOpen,
  Star,
  Crown,
  Zap,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ValueItem {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  gradient: string;
  bgColor: string;
}

const coreValues: ValueItem[] = [
  {
    title: "Discipline",
    description:
      "Maintaining order, self-control, and structured learning environments",
    icon: Shield,
    gradient: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Honesty",
    description: "Upholding truthfulness and transparency in all our endeavors",
    icon: CheckCircle,
    gradient: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Integrity",
    description: "Acting with moral principles and ethical standards always",
    icon: Crown,
    gradient: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  {
    title: "Hard Work",
    description: "Dedicating effort and perseverance to achieve excellence",
    icon: Zap,
    gradient: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    title: "Compassion",
    description: "Showing empathy, kindness, and understanding to others",
    icon: Heart,
    gradient: "from-pink-500 to-rose-500",
    bgColor: "bg-pink-50 dark:bg-pink-950/20",
  },
  {
    title: "Fear of God",
    description: "Respecting divine authority and spiritual guidance",
    icon: Star,
    gradient: "from-indigo-500 to-purple-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-950/20",
  },
  {
    title: "Love for God and Country",
    description:
      "Demonstrating devotion to divine purpose and national service",
    icon: Users,
    gradient: "from-teal-500 to-cyan-500",
    bgColor: "bg-teal-50 dark:bg-teal-950/20",
  },
];

export default function VisionMissionPage() {
  const container = useRef<HTMLDivElement>(null);
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".vision-badge", { opacity: 0, y: 50, scale: 0.8 });
      gsap.set(".vision-section", { opacity: 0, y: 80, rotationX: 45 });
      gsap.set(".mission-section", { opacity: 0, y: 80, rotationX: 45 });
      gsap.set(".values-header", { opacity: 0, y: 60, scale: 0.9 });
      gsap.set(".value-card", {
        opacity: 0,
        y: 100,
        scale: 0.8,
        rotationY: 45,
      });
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
        .to(".vision-badge", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .to(
          ".vision-section",
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
          ".mission-section",
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.7",
        );

      // Values section animation
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".values-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .to(".values-header", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
        })
        .to(".value-card", {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "back.out(1.2)",
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
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.5,
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
      <div className="floating-decoration floating-element parallax-bg absolute top-1/2 -left-32 w-64 h-64 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-3xl" />
      <div className="floating-decoration floating-element parallax-bg absolute bottom-0 right-1/4 w-32 h-32 bg-gradient-to-br from-secondary/10 to-accent/10 rounded-full blur-2xl" />

      <div className="flex flex-col gap-16">
        {/* Header Badge */}
        <div className="vision-badge flex justify-center">
          <Badge
            variant="secondary"
            className="px-6 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-md border-primary/20 text-primary hover:from-primary/20 hover:to-secondary/20 transition-all duration-300 text-lg"
          >
            <BookOpen className="w-5 h-5 mr-2" />
            Our Foundation
          </Badge>
        </div>

        {/* Vision Section */}
        <Card className="vision-section relative overflow-hidden bg-gradient-to-br from-background/80 to-accent/30 backdrop-blur-xl border-border/50 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl" />
          <div className="absolute top-6 right-6">
            <Eye className="w-6 h-6 text-primary/30" />
          </div>

          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Icon Section */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-10 h-10 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Our Vision
                  </h2>
                  <Sparkles className="w-6 h-6 text-blue-500" />
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-6" />
                <p className="text-lg md:text-xl leading-relaxed text-foreground/80">
                  To be a center of academic excellence and discipline,
                  committed to nurturing holistically developed students who are
                  well-prepared for the job market, adult life, and higher
                  education.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mission Section */}
        <Card className="mission-section relative overflow-hidden bg-gradient-to-br from-background/80 to-accent/30 backdrop-blur-xl border-border/50 shadow-2xl">
          {/* Decorative elements */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl" />
          <div className="absolute bottom-6 left-6">
            <Target className="w-6 h-6 text-primary/30" />
          </div>

          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Content */}
              <div className="flex-1 md:order-2">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    Our Mission
                  </h2>
                  <Sparkles className="w-6 h-6 text-green-500" />
                </div>
                <div className="h-1 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6" />
                <p className="text-lg md:text-xl leading-relaxed text-foreground/80">
                  To deliver quality instruction, effective guidance and
                  counselling, and a conducive learning environment rooted in
                  Christian values—holistically preparing learners for the world
                  of work, adult life, and further education.
                </p>
              </div>

              {/* Icon Section */}
              <div className="flex-shrink-0 md:order-1">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Target className="w-10 h-10 text-white" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Values Section */}
        <div className="values-section">
          <div className="values-header text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Core Values
              </h2>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These fundamental principles guide our daily actions and shape the
              character of our school community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              const isHovered = hoveredValue === index;

              return (
                <Card
                  key={value.title}
                  className="value-card group cursor-default relative overflow-hidden bg-background/60 backdrop-blur-xl border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105"
                  onMouseEnter={() => setHoveredValue(index)}
                  onMouseLeave={() => setHoveredValue(null)}
                >
                  {/* Gradient background overlay */}
                  <div
                    className={`
                      absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500
                      ${value.gradient}
                      ${isHovered ? "opacity-5" : "opacity-0"}
                    `}
                  />

                  {/* Decorative corner */}
                  <div className="absolute -top-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardContent className="relative p-6">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className={`
                          flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300
                          ${
                            isHovered
                              ? `bg-gradient-to-br ${value.gradient} text-white shadow-lg scale-110`
                              : `${value.bgColor} text-muted-foreground`
                          }
                        `}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-xl border-border/50">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Experience Our Values</h3>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              These values form the foundation of everything we do at NPRESEC,
              shaping minds and building character.
            </p>
            <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300">
              Learn More About Us
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
