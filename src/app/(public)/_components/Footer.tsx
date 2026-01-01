"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicMainContainer } from "./PublicMainContainer";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
  MapPin,
  Phone,
  Clock,
  Send,
  Heart,
  Star,
  Sparkles,
  ExternalLink,
  ArrowUp,
  Globe,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Logo from "@/../public/logo.png";
import { Route } from "next";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

interface FooterLink {
  title: string;
  href: string;
  isExternal?: boolean;
}

interface SocialLink {
  platform: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  bgColor: string;
}

const aboutLinks: FooterLink[] = [
  { title: "Our Story", href: "/about" },
  { title: "Vision & Mission", href: "/about/vision-mission" },
  { title: "Board of Governors", href: "/about/board-of-governors" },
  { title: "Leadership Team", href: "/about/leadership" },
  { title: "School Policies", href: "/about/policies" },
];

const admissionLinks: FooterLink[] = [
  { title: "How to Apply", href: "/admissions/apply" },
  { title: "Admission List", href: "/admissions/list" },
  { title: "Entry Requirements", href: "/admissions/requirements" },
  { title: "Learning Areas", href: "/programs" },
  { title: "Scholarships", href: "/admissions/scholarships" },
];

const quickLinks: FooterLink[] = [
  { title: "Student Portal", href: "/students" },
  { title: "Teacher Portal", href: "/teachers" },
  { title: "Alumni Network", href: "/alumni" },
  { title: "School Library", href: "/library" },
  { title: "News & Events", href: "/news" },
  { title: "Contact Us", href: "/contact" },
];

const socialLinks: SocialLink[] = [
  {
    platform: "Facebook",
    icon: Facebook,
    href: "https://www.facebook.com/nakpanduripresec",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    platform: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/npresec/",
    color: "text-pink-600",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    platform: "YouTube",
    icon: Youtube,
    href: "https://www.youtube.com/@nakpanduripresec",
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/30",
  },
  {
    platform: "Twitter",
    icon: Twitter,
    href: "https://twitter.com/NPresec40215",
    color: "text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    platform: "LinkedIn",
    icon: Linkedin,
    href: "https://www.linkedin.com/company/nakpanduri-presbyterian-senior-high-technical-school/",
    color: "text-blue-700",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    platform: "Email",
    icon: Mail,
    href: "mailto:admissions@nakpanduripresec.org",
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
];

export const Footer = () => {
  const container = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useGSAP(
    () => {
      // Early return if container is not available
      if (!container.current) return;

      // Set visibility flag
      setIsVisible(true);

      // Minimal initial states - content stays visible
      gsap.set(".footer-badge", { rotation: -5 });
      gsap.set(".footer-logo", { rotation: -2 });
      gsap.set(".social-icon", { scale: 0.98 });
      gsap.set(".floating-elements", { opacity: 0.8 });

      // Store all ScrollTrigger instances for cleanup
      const scrollTriggers: ScrollTrigger[] = [];

      // Simplified animation - subtle enhancements only
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: container.current,
          start: "top 90%",
          toggleActions: "play none none none",
          id: "footer-main",
        },
      });

      // Subtle entrance animations
      mainTl
        .to(".footer-badge", {
          rotation: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        .to(
          ".footer-logo",
          {
            rotation: 0,
            duration: 0.5,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          ".social-icon",
          {
            scale: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.2",
        );

      // Simple cleanup
      return () => {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.vars.id === "footer-main") {
            st.kill();
          }
        });
      };
    },
    { scope: container },
  );

  // Social icon hover animation
  const handleSocialHover = (index: number, isEntering: boolean) => {
    if (!container.current) return;

    const icon = container.current?.querySelector(`.social-icon-${index}`);
    if (!icon) return;

    gsap.to(icon, {
      scale: isEntering ? 1.2 : 1,
      y: isEntering ? -8 : 0,
      rotation: isEntering ? 10 : 0,
      duration: 0.4,
      ease: "back.out(1.7)",
    });

    setHoveredSocial(isEntering ? index : null);
  };

  // Newsletter submission
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setEmail("");
    setIsSubmitting(false);
    // Add success notification here
  };

  // Scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={container}
      className="relative bg-gradient-to-b from-background via-accent/30 to-background overflow-hidden"
    >
      {/* Background Elements */}
      <div className="footer-background absolute inset-0">
        {/* Gradient Mesh Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-500/5 to-pink-500/10" />
        <div className="absolute inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-purple-500/5" />

        {/* Logo Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5">
          <Image
            src={Logo}
            alt=""
            width={400}
            height={400}
            className="w-96 h-96 object-contain"
          />
        </div>

        {/* Decorative Blurs */}
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      {/* Floating Decorative Elements */}
      <div className="floating-elements absolute inset-0 pointer-events-none overflow-hidden">
        <div className="floating-star-1 absolute top-20 left-[10%] w-6 h-6 text-primary/20">
          <Star className="w-full h-full" fill="currentColor" />
        </div>
        <div className="floating-star-2 absolute top-40 right-[15%] w-4 h-4 text-orange-500/30">
          <Star className="w-full h-full" fill="currentColor" />
        </div>
        <div className="absolute bottom-32 left-[20%] w-8 h-8 text-pink-500/20">
          <Sparkles className="w-full h-full" />
        </div>
      </div>

      <div className="footer-container relative z-10">
        <PublicMainContainer className="py-16 md:py-24">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="footer-badge inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary/15 to-orange-500/15 backdrop-blur-sm rounded-full border border-primary/30 mb-8 shadow-lg">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-primary tracking-wider">
                CONNECT WITH US
              </span>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
              <div className="footer-logo">
                <Image
                  src={Logo}
                  alt="Presbyterian SHTS Nakpanduri Logo"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-orange-500 to-pink-500 bg-clip-text text-transparent mb-2">
                  Presbyterian SHTS Nakpanduri
                </h2>
                <p className="text-muted-foreground">
                  Nurturing Excellence • Building Futures • Inspiring Leaders
                </p>
              </div>
            </div>
          </div>

          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Contact Information */}
            <div className="footer-section">
              <Card className="h-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-gradient-to-br from-primary to-orange-500 rounded-lg">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground">
                      Contact Info
                    </h3>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Address</p>
                        <p className="text-muted-foreground">
                          Post Office Box 22
                          <br />
                          Nakpanduri, North East Region
                          <br />
                          Ghana
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Phone</p>
                        <a
                          href="tel:+233540649355"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          +233 (0) 540 649 355
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">Email</p>
                        <a
                          href="mailto:admissions@nakpanduripresec.org"
                          className="text-muted-foreground hover:text-primary transition-colors break-all"
                        >
                          admissions@nakpanduripresec.org
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-foreground">
                          Office Hours
                        </p>
                        <p className="text-muted-foreground">
                          Mon - Fri: 8:00 AM - 5:00 PM
                          <br />
                          Sat: 8:00 AM - 12:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Links */}
            <div className="footer-section">
              <Card className="h-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                      <Heart className="w-5 h-5 text-white" />
                    </div>
                    About Us
                  </h3>
                  <div className="space-y-2">
                    {aboutLinks.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href as Route}
                        className="footer-link-item block py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 group"
                      >
                        <span className="flex items-center justify-between">
                          {link.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Admissions Links */}
            <div className="footer-section">
              <Card className="h-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    Admissions
                  </h3>
                  <div className="space-y-2">
                    {admissionLinks.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href as Route}
                        className="footer-link-item block py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 group"
                      >
                        <span className="flex items-center justify-between">
                          {link.title}
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </span>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Links & Newsletter */}
            <div className="footer-section">
              <div className="space-y-6">
                {/* Quick Links */}
                <Card className="bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-6 text-foreground flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                        <Star className="w-5 h-5 text-white" />
                      </div>
                      Quick Links
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {quickLinks.slice(0, 4).map((link, index) => (
                        <Link
                          key={link.href}
                          href={link.href as Route}
                          className="footer-link-item block py-2 px-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 text-sm group"
                        >
                          <span className="flex items-center justify-between">
                            {link.title}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Newsletter */}
                <Card className="newsletter-section bg-gradient-to-br from-primary/10 to-orange-500/10 backdrop-blur-sm border border-primary/20 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-3 text-foreground">
                      Stay Updated
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Get the latest news and updates from NPRESEC.
                    </p>
                    <form
                      onSubmit={handleNewsletterSubmit}
                      className="space-y-3"
                    >
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-background/80 border-primary/30"
                        required
                      />
                      <Button
                        type="submit"
                        size="sm"
                        disabled={isSubmitting}
                        className="w-full group"
                      >
                        {isSubmitting ? (
                          "Subscribing..."
                        ) : (
                          <>
                            Subscribe
                            <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          <Separator className="my-8 opacity-30" />

          {/* Social Media Section */}
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold mb-6 text-foreground">
              Follow Our Journey
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <div key={social.platform} className="social-icon">
                    <Link
                      href={social.href as any}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`social-icon-${index} group relative p-4 rounded-2xl ${social.bgColor} border border-border/30 hover:border-current transition-all duration-300 block`}
                      onMouseEnter={() => handleSocialHover(index, true)}
                      onMouseLeave={() => handleSocialHover(index, false)}
                    >
                      <Icon
                        className={`w-6 h-6 ${social.color} transition-colors duration-300`}
                      />
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-background border border-border rounded-lg px-3 py-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        {social.platform}
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </PublicMainContainer>

        {/* Bottom Footer */}
        <div className="footer-bottom bg-gradient-to-r from-background/95 via-accent/20 to-background/95 backdrop-blur-sm border-t border-border/30">
          <PublicMainContainer className="py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  <span className="hidden md:inline">
                    Presbyterian Senior High Technical School •{" "}
                  </span>
                  NPRESEC © {new Date().getFullYear()}
                </div>
                <Badge variant="outline" className="text-xs">
                  North East Region
                </Badge>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  Made with{" "}
                  <Heart className="w-3 h-3 text-red-500" fill="currentColor" />{" "}
                  for Education
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={scrollToTop}
                  className="group"
                >
                  <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform duration-300" />
                  <span className="sr-only">Back to top</span>
                </Button>
              </div>
            </div>
          </PublicMainContainer>
        </div>
      </div>
    </footer>
  );
};
