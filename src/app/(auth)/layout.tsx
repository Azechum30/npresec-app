import Image from "next/image";
import Link from "next/link";
import React from "react";
import Logo from "@/../public/logo.png";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative flex items-center justify-center w-full min-h-svh">
      <Link
        href="/"
        className={buttonVariants({
          variant: "outline",
          className: "absolute top-4 left-4",
        })}>
        <ArrowLeft className="size-4" />
        <span>Back</span>
      </Link>
      <div className="flex w-full flex-col max-w-sm gap-6">
        <Link
          href="/"
          className="flex self-center font-medium items-center gap-2 ">
          <div className="size-10 p-1 border-2 rounded-md flex items-center">
            <Image
              src={Logo}
              alt="Logo"
              className="size-9 object-contain object-center"
            />
          </div>
          <span className="font-bold">Presby SHTS.</span>
        </Link>
        {children}
        <div className="text-center text-xs text-muted-foreground text-balance">
          By clicking continue, you agree to our{" "}
          <span className="underline hover:text-primary hover:cursor-pointer">
            Terms of Service
          </span>{" "}
          and{" "}
          <span className="underline hover:text-primary hover:cursor-pointer">
            Privacy Policy
          </span>
          .
        </div>
      </div>
    </div>
  );
}
