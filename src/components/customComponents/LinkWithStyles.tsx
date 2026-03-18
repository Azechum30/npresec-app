"use client";

import { useOpenSidebar } from "@/hooks/use-open-sidebar";
import { cn } from "@/lib/utils";
import { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function LinkWithStyles({
  href,
  title,
  className,
  icon,
}: {
  href: string;
  title: string;
  className?: string;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  const { open, setOpen } = useOpenSidebar();

  const handlLinkClose = () => {
    const isMatch = window.matchMedia("(max-width: 768px)").matches;

    if (isMatch && open) {
      setOpen(true);
    }
  };

  return (
    <Link
      onClick={handlLinkClose}
      href={href as Route}
      className={cn(
        icon &&
          "flex items-center gap-x-4 sm:gap-x-1 lg:gap-x-4 w-full hover:cursor-pointer",
        className,
        href === pathname && !icon && "text-accent",
        href === pathname && icon && "bg-accent",
      )}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger
            className={cn(
              "flex items-center hover:cursor-pointer gap-x-4 sm:gap-x-1 lg:gap-x-4 h-full w-full",
              href === pathname && !icon && "text-accent",
              href === pathname && icon && "bg-accent",
            )}>
            <span className={cn("hidden size-5", icon && "inline-flex")}>
              {icon}
            </span>
            <span className="inline-flex">{title}</span>
          </TooltipTrigger>
          <TooltipContent align="center">{`Link to ${title} page`}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Link>
  );
}
