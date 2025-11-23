"use client";

import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarLinks = [
  { name: "Brief History", href: "/about" },
  { name: "Our Vision & Mission", href: "/about/vision-mission" },
  { name: "Core Values", href: "/about/core-values" },
  { name: "Board of Governors", href: "/about/board-of-governors" },
  { name: "School Anthem", href: "/about/school-anthem" },
];
export const AboutSidebar = () => {
  const pathname = usePathname().split("/").pop();
  return (
    <div className="sticky top-16 z-30 shadow-lg rounded-md bg-background  border-border  py-4 px-3">
      <div className="flex flex-col gap-2">
        {SidebarLinks.map((link) => {
          return (
            <Link
              className={buttonVariants({
                variant: "link",
                className:
                  pathname === link.href.split("/").pop()
                    ? "justify-start text-[16px] font-bold text-secondary-foreground dark:text-primary-foreground hover:text-primary rounded-none transition-all duration-150 hover:border-border underline "
                    : "justify-start text-[16px] font-normal text-secondary-foreground dark:text-primary-foreground hover:text-primary rounded-none transition-all duration-150 hover:border-border ",
              })}
              href={link.href}
              key={link.href}>
              {link.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
