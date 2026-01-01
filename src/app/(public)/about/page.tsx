"use client";

import { useRef } from "react";
import { PublicMainContainer } from "../_components/PublicMainContainer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Users,
  Award,
  BookOpen,
  Building,
  GraduationCap,
  Heart,
  Target,
  Eye,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const timelineEvents = [
  {
    year: 1981,
    title: "Agricultural Rehabilitation Center",
    description:
      "Presbyterian Church of Ghana founded the Agricultural Rehabilitation Center for the Blind (ARB).",
    icon: Building,
    color: "from-blue-500 to-cyan-500",
  },
  {
    year: 1991,
    title: "ARB Closure",
    description:
      "The Agricultural Rehabilitation Center for the Blind was closed after serving the community for a decade.",
    icon: Calendar,
    color: "from-gray-500 to-slate-500",
  },
  {
    year: 1992,
    title: "Junior High School Launch",
    description:
      "The Church repurposed the facility to launch Nakpanduri Presbyterian Junior High School (JHS).",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
  },
  {
    year: 2010,
    title: "Vocational Training Institute",
    description:
      "The site was restructured into a Vocational Training Institute to meet evolving educational needs.",
    icon: Award,
    color: "from-purple-500 to-pink-500",
  },
  {
    year: 2012,
    title: "Senior High Technical School",
    description:
      "Converted to SHTS with 97 students (57 boys, 40 girls) marking a new milestone in education.",
    icon: GraduationCap,
    color: "from-orange-500 to-red-500",
  },
  {
    year: 2015,
    title: "Official Accreditation",
    description:
      "NPRESEC received official accreditation from the National Accreditation Board of Ghana.",
    icon: CheckCircle,
    color: "from-teal-500 to-cyan-500",
  },
  {
    year: 2022,
    title: "Government-Assisted Status",
    description:
      "Transition to Government-Assisted Senior High Technical School under Mr. Mohammed Michael Issah.",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
  },
];

const achievements = [
  {
    title: "Academic Excellence",
    description: "Consistent performance in WASSCE with improving pass rates",
    icon: Award,
    color: "text-yellow-500",
  },
  {
    title: "Diverse Programs",
    description: "Six learning areas serving diverse student interests",
    icon: BookOpen,
    color: "text-blue-500",
  },
  {
    title: "Community Impact",
    description: "Serving the Bunkprugu-Nakpanduri District and beyond",
    icon: Heart,
    color: "text-red-500",
  },
  {
    title: "Skilled Graduates",
    description:
      "Producing technically skilled and academically sound graduates",
    icon: GraduationCap,
    color: "text-green-500",
  },
];

export default function AboutPage() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".about-hero", { opacity: 0, y: 100 });
      gsap.set(".about-badge", { opacity: 0, scale: 0.3, rotation: -180 });
      gsap.set(".about-title", { opacity: 0, y: 80, skewY: 10 });
      gsap.set(".about-subtitle", {
        opacity: 0,
        y: 40,
        clipPath: "inset(100% 0 0 0)",
      });
      gsap.set(".timeline-section", { opacity: 0, y: 60 });
      gsap.set(".timeline-item", { opacity: 0, x: -100, scale: 0.8 });
      gsap.set(".achievements-section", { opacity: 0, y: 80 });
      gsap.set(".achievement-card", { opacity: 0, y: 60, rotationX: 45 });
      gsap.set(".mission-vision", { opacity: 0, y: 60, scale: 0.95 });
      gsap.set(".cta-section", { opacity: 0, y: 40 });

      // Main entrance animation
      const mainTl = gsap.timeline({ delay: 0.2 });

      mainTl
        .to(".about-hero", {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
        })
        .to(
          ".about-badge",
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 1,
            ease: "back.out(1.7)",
          },
          "-=0.8",
        )
        .to(
          ".about-title",
          {
            opacity: 1,
            y: 0,
            skewY: 0,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.6",
        )
        .to(
          ".about-subtitle",
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0 0 0)",
            duration: 1,
            ease: "power2.out",
          },
          "-=0.4",
        );

      // Timeline section animation
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".timeline-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .to(".timeline-section", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        })
        .to(
          ".timeline-item",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.8,
            stagger: {
              amount: 1.2,
              from: "start",
            },
            ease: "back.out(1.3)",
          },
          "-=0.5",
        );

      // Achievements section animation
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".achievements-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .to(".achievements-section", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        })
        .to(
          ".achievement-card",
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 1,
            stagger: 0.2,
            ease: "back.out(1.3)",
          },
          "-=0.5",
        );

      // Mission/Vision section animation
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".mission-vision",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        })
        .to(".mission-vision", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "power2.out",
        });

      // CTA section animation
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".cta-section",
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
        .to(".cta-section", {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
        });

      // Floating animations
      gsap.to(".about-badge", {
        y: -8,
        rotation: 5,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: 2,
      });

      // Parallax effects
      gsap.to(".timeline-item", {
        y: (i) => -30 * (i + 1),
        ease: "none",
        scrollTrigger: {
          trigger: ".timeline-section",
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

  return (
    <div
      ref={container}
      className="min-h-screen bg-gradient-to-b from-background to-accent/20 overflow-hidden"
    >
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -left-40 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-500/3 to-blue-500/3 rounded-full blur-3xl" />
      </div>

      <PublicMainContainer className="relative z-10 py-16 md:py-24">
        {/* Hero Section */}
        <div className="about-hero text-center mb-20">
          <div className="about-badge inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary/10 to-orange-500/10 rounded-full border border-primary/20 mb-8">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-primary">
              OUR STORY
            </span>
          </div>

          <h1 className="about-title text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent">
            A Legacy of Excellence
          </h1>

          <div className="about-subtitle max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8">
              From humble beginnings to educational excellence, discover the
              remarkable journey of Presbyterian SHTS Nakpanduri—a story of
              transformation, resilience, and unwavering commitment to nurturing
              young minds.
            </p>
          </div>
        </div>

        {/* Brief History Section */}
        <div className="mb-20">
          <Card className="p-8 md:p-12 bg-background/80 backdrop-blur-sm border border-border/50 shadow-xl">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-primary to-orange-500 rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                  Brief History
                </h2>
              </div>

              <div className="prose prose-lg max-w-none text-muted-foreground space-y-6">
                <p className="text-lg leading-relaxed">
                  <strong className="text-foreground">
                    Nakpanduri Presbyterian Senior High Technical School
                    (NPRESEC)
                  </strong>{" "}
                  stands as a beacon of transformation and educational growth,
                  officially established in 2010 after undergoing several
                  transitional phases.
                </p>

                <p className="leading-relaxed">
                  The institution traces its origins to{" "}
                  <strong className="text-primary">1981</strong>, when the
                  Presbyterian Church of Ghana founded the Agricultural
                  Rehabilitation Center for the Blind (ARB). This initiative
                  served the community until its closure in 1991.
                </p>

                <p className="leading-relaxed">
                  In response to the collapse of the ARB, the Church repurposed
                  the facility to launch the{" "}
                  <strong className="text-foreground">
                    Nakpanduri Presbyterian Junior High School (JHS)
                  </strong>{" "}
                  in 1992, continuing its commitment to education and social
                  development.
                </p>

                <p className="leading-relaxed">
                  In <strong className="text-primary">2010</strong>, the site
                  was restructured into a Vocational Training Institute.
                  However, due to low enrolment, the institution was converted
                  into a Senior High Technical School (SHTS) during the
                  2012/2013 academic year. At inception, the school enrolled{" "}
                  <strong className="text-foreground">
                    97 students—57 boys and 40 girls
                  </strong>
                  —marking a significant milestone in its evolution.
                </p>

                <p className="leading-relaxed">
                  Following its transition to a{" "}
                  <strong className="text-primary">
                    Government-Assisted Senior High Technical School
                  </strong>{" "}
                  in February 2022, Mr. Mohammed Michael Issah was appointed as
                  the first Headmaster under government administration, marking
                  a new chapter in the school&apos;s journey toward excellence
                  and inclusive education.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline Section */}
        <div className="timeline-section mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Our Journey Through Time
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From inception to excellence—witness the transformative milestones
              that shaped NPRESEC into the institution it is today.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-orange-500 transform md:-translate-x-1/2" />

            <div className="space-y-12">
              {timelineEvents.map((event, index) => {
                const Icon = event.icon;
                const isEven = index % 2 === 0;

                return (
                  <div
                    key={event.year}
                    className={`timeline-item relative flex items-center gap-8 ${
                      isEven ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 z-10">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${event.color} rounded-full flex items-center justify-center shadow-lg border-4 border-background`}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Content Card */}
                    <div
                      className={`flex-1 ml-20 md:ml-0 ${isEven ? "md:mr-8" : "md:ml-8"}`}
                    >
                      <Card className="p-6 bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                        <CardContent className="p-0">
                          <div className="flex items-center gap-3 mb-3">
                            <Badge
                              variant="outline"
                              className={`bg-gradient-to-r ${event.color} text-white border-0`}
                            >
                              {event.year}
                            </Badge>
                            <h3 className="text-xl font-bold text-foreground">
                              {event.title}
                            </h3>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {event.description}
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Spacer for alternating layout */}
                    <div className="hidden md:block flex-1" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="achievements-section mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Our Achievements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Celebrating the milestones that define our commitment to
              educational excellence and community development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;

              return (
                <Card
                  key={index}
                  className="achievement-card group p-6 bg-background/80 backdrop-blur-sm border border-border/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-0 text-center">
                    <div
                      className={`inline-flex p-4 rounded-2xl bg-gradient-to-br from-background to-accent/30 mb-4 ${achievement.color}`}
                    >
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-primary transition-colors duration-300">
                      {achievement.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {achievement.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="mission-vision mb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-blue-500/5 border border-primary/20 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-primary to-blue-500 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-primary">
                    Our Mission
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To provide quality technical and academic education that
                  nurtures intellectual growth, character development, and
                  practical skills, empowering students to become innovative
                  leaders and responsible citizens in an ever-evolving global
                  society.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 bg-gradient-to-br from-orange-500/5 to-pink-500/5 border border-orange-500/20 shadow-lg">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-orange-500">
                    Our Vision
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be the premier center of excellence for technical and
                  academic education in the North East Region of Ghana,
                  recognized for producing skilled, innovative, and ethically
                  grounded graduates who drive positive change in their
                  communities and beyond.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section text-center">
          <Card className="p-12 bg-gradient-to-br from-primary/10 via-orange-500/5 to-pink-500/10 border border-primary/20 shadow-xl">
            <CardContent className="p-0">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                Ready to Join Our Legacy?
              </h3>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Become part of our continuing story of excellence. Explore our
                programs and discover how NPRESEC can shape your future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={"/programs" as Route}>
                  <Button size="lg" className="group px-8 py-4">
                    <span className="mr-2">Explore Programs</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>

                <Link href={"/contact" as Route}>
                  <Button variant="outline" size="lg" className="px-8 py-4">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicMainContainer>
    </div>
  );
}
