"use client";
import Image from "next/image";
import { PublicMainContainer } from "./PublicMainContainer";
import Logo from "@/../public/logo.png";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

type AboutLink = {
  title: string;
  href: string;
};

const aboutLinks: AboutLink[] = [
  {
    title: "Background of School",
    href: "/about",
  },
  {
    title: "Vision, Mission and Core Values",
    href: "/about/strategic-vision",
  },
  {
    title: "Board of Governors",
    href: "/about/board-of-governors",
  },
  {
    title: "Management Team",
    href: "/about/management-team",
  },
  {
    title: "School Polcies",
    href: "/about/school-policies",
  },
  {
    title: "School Organization Structure",
    href: "/about/school-organization-structure",
  },
];

const AdmissionLinks: AboutLink[] = [
  {
    title: "How to Apply",
    href: "/admissions/how-to-apply",
  },
  {
    title: "Admission List",
    href: "/admissions/list",
  },
  {
    title: "Entry Requirements",
    href: "/admissions/entry-requirements",
  },
  {
    title: "Key Learning Areas",
    href: "/admissions/learning-areas",
  },
];

const keyLinks: AboutLink[] = [
  {
    title: "Admissions List",
    href: "/admission",
  },
  {
    title: "Learning Areas or Programs",
    href: "/programs",
  },
  {
    title: "Students Portal",
    href: "/students",
  },
  {
    title: "Alumini Platform",
    href: "/alumini-platform",
  },
  {
    title: "Teachers Portal",
    href: "/teachers",
  },
  {
    title: "School Library",
    href: "/library",
  },
];

const socialLinks = [
  {
    icon: <Facebook className="size-6" aria-hidden />,
    href: "https://www.facebook.com/nakpanduripresec",
  },
  {
    icon: <Instagram className="size-6" aria-hidden />,
    href: "https://www.instagram.com/npresec/",
  },
  {
    icon: <Youtube className="size-6" />,
    href: "https://www.youtube.com/@nakpanduripresec",
  },
  {
    icon: <Mail className="size-6" aria-hidden />,
    href: "mailto:admissions@nakpanduripresec.org",
  },
  {
    icon: <Twitter className="size-6" aria-hidden />,
    href: "https://twitter.com/NPresec40215",
  },
  {
    icon: <Linkedin className="size-8" />,
    href: "https://www.linkedin.com/company/nakpanduri-presbyterian-senior-high-technical-school/",
  },
];
gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(useGSAP);

export const Footer = () => {
  const footerContainerRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerContainerRef.current,
        },
      });

      tl.from(".background-image", {
        opacity: 0,
        scale: 0.8,
        duration: 1.5,
        ease: "power2.inOut",
      });

      tl.from(".footer-container", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power2.inOut",
      });
      tl.from(".footer-grid", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power2.inOut",
      });

      tl.from(".footer-grid-children", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        stagger: 0.2,
        ease: "power2.inOut",
      });

      tl.from(".footer-copyright", {
        opacity: 0,
        duration: 1.5,
        y: 100,
        ease: "power2.inOut",
      });

      tl.from(".footer-copyright-content", {
        opacity: 0,
        y: 100,
        duration: 1.5,
        ease: "power2.inOut",
        stagger: 0.2,
      });
    },
    { scope: footerContainerRef }
  );
  return (
    <footer ref={footerContainerRef} className=" relative">
      <div
        className="background-image bg-primary dark:bg-background opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-contain bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/logo.png)" }}></div>
      <div className="px-4 md:px-6 lg:px-8 z-10 relative bg-primary/95 dark:bg-background/95 footer-container">
        <PublicMainContainer className="py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 footer-grid ">
            <div className="flex flex-col gap-4 footer-grid-children">
              <h4 className="text-primary-foreground pb-6 text-xl font-bold relative after:absolute after:top-10/12 after:left-0 after:inset-0 after:text-center after:h-[1px] after:w-full after:flex after:items-center after:justify-start after:bg-primary-foreground/50">
                Contact US
              </h4>
              <Image src={Logo} alt="Logo" className="w-24 h-24" />
              <address className="not-italic text-primary-foreground/75 text-sm leading-loose line-clamp-6 ">
                Post Office Box 22 <br />
                Nakpanduri, North East Region <br />
                +233-(0)540-649-355 <br />
                admissions@nakpanduripresec.org
              </address>
            </div>
            <div className="flex flex-col gap-4 footer-grid-children">
              <h4 className="text-primary-foreground pb-6 text-xl font-bold relative after:absolute after:top-10/12 after:left-0 after:inset-0 after:text-center after:h-[1px] after:w-full after:flex after:items-center after:justify-start after:bg-primary-foreground/50">
                Who We Are
              </h4>
              <div>
                {aboutLinks.map((link, index) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className={buttonVariants({
                      variant: "link",
                      className:
                        "px-px py-5 text-primary-foreground/75 hover:text-primary-foreground w-full justify-start",
                    })}>
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 footer-grid-children">
              <h4 className="text-primary-foreground pb-6 text-xl font-bold relative after:absolute after:top-10/12 after:left-0 after:inset-0 after:text-center after:h-[1px] after:w-full after:flex after:items-center after:justify-start after:bg-primary-foreground/50">
                Admissions
              </h4>
              <div>
                {AdmissionLinks.map((link, index) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className={buttonVariants({
                      variant: "link",
                      className:
                        "px-px py-5 text-primary-foreground/75 hover:text-primary-foreground w-full justify-start",
                    })}>
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4 footer-grid-children">
              <h4 className="text-primary-foreground pb-6 text-xl font-bold relative after:absolute after:top-10/12 after:left-0 after:inset-0 after:text-center after:h-[1px] after:w-full after:flex after:items-center after:justify-start after:bg-primary-foreground/50">
                Key Strategic Links
              </h4>
              <div>
                {keyLinks.map((link, index) => (
                  <Link
                    href={link.href}
                    key={link.href}
                    className={buttonVariants({
                      variant: "link",
                      className:
                        "px-px py-5 text-primary-foreground/75 hover:text-primary-foreground w-full justify-start",
                    })}>
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </PublicMainContainer>
      </div>
      <div className="footer-copyright bg-accent-foreground text-primary-foreground text-sm dark:bg-primary w-full py-2 relative px-4 md:px-6 lg:px-16 z-20 uppercase flex items-center  justify-between">
        <p className="footer-copyright-content ">
          <span className="hidden lg:inline-flex">
            Presbyterian Senior High Technical School &nbsp; | &nbsp;{" "}
          </span>
          NPRESEC &copy; 2025{" "}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2 lg:mt-0 footer-copyright-content">
          {socialLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              target="_blank"
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
                className:
                  "hover:-translate-y-2 transition-transform duration-500 ease-in-out",
              })}>
              {link.icon}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
