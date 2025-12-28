"use client";

import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import Link from "next/link";
import { Links } from "./Navbar";
import { buttonVariants } from "../ui/button";
import { ThemeSwitcher } from "./ThemeSwitecher";
import { LogIn } from "lucide-react";
import { useAuth } from "./SessionProvider";
import { Route } from "next";

export const MobileNavbar = () => {
  const { onClose, dialogs } = useGenericDialog();
  return (
    <Sheet
      open={dialogs["mobile-nav"]}
      onOpenChange={() => onClose("mobile-nav")}
    >
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            These are navigation menus for visiting different sections of the
            our website
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col justify-between h-full border-t py-4">
          <div className="flex flex-col gap-2 px-2">
            {Links.map((link) => (
              <Link
                onClick={() => onClose("mobile-nav")}
                href={link.href as Route}
                key={link.href}
                className={buttonVariants({
                  variant: "ghost",
                  className: "justify-start hover:text-primary",
                })}
              >
                {link.title}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2 px-4 py-4 border-t">
            {/*<div className="hidden md:inline-flex">*/}
            <ThemeSwitcher />
            {/*</div>*/}

            <div className="flex items-center space-x-2">
              {/*<Link href="/" className={buttonVariants()}>
                  Get Started
                </Link>*/}
              <Link
                href="/sign-in"
                onAbort={() => onClose("mobile-nav")}
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                <LogIn className="size-4" aria-hidden={true} />
                <span>Login</span>
              </Link>
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
