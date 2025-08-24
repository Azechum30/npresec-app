import Link from "next/link";
import Image from "next/image";
import Logo from "@/../public/logo.png";
import { getAuthUser } from "@/lib/getAuthUser";
import { ThemeSwitcher } from "./ThemeSwitecher";
import { UserProfile } from "@/app/(public)/_components/UserProfile";
import { buttonVariants } from "../ui/button";
import { LogIn } from "lucide-react";
import { TriggerMobileNavbar } from "./TriggerMobileNavbar";

type NavigationLinksProps = {
  href: string;
  title: string;
};

export const Links: NavigationLinksProps[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "About",
    href: "/about",
  },
  {
    title: "Admissions",
    href: "/admissions",
  },
];

export type AuthUserType = {
  id?: string;
  email?: string;
  username?: string;
  picture?: string | null;
};

export default async function Navbar() {
  const user = await getAuthUser();

  let authUser: AuthUserType = {};
  if (user) {
    const { role, permissions, ...rest } = user;
    authUser = rest;
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex min-h-16 items-center px-2 md:px-6 lg:px-8 py-2 relative">
        <Link href="/" className="flex items-center gap-2 mr-4">
          <div className="flex items-center p-1 border rounded-md size-10">
            <Image
              src={Logo}
              alt="Logo"
              className="size-9 object-contain object-center"
            />
          </div>
          <span className="font-bold uppercase">PresbySHTS.</span>
        </Link>
        {/** Desktop Navigation */}
        <nav className="hidden md:flex md:justify-between md:items-center w-full">
          <div className="flex items-center space-x-2">
            {Links.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.title}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <ThemeSwitcher />
            {user ? (
              <UserProfile user={authUser} />
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/" className={buttonVariants()}>
                  Get Started
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonVariants({
                    variant: "outline",
                  })}>
                  <LogIn className="size-4" aria-hidden={true} />
                  <span>Login</span>
                </Link>
              </div>
            )}
          </div>
        </nav>
        {/** Mobile Navigation */}
        <div className="md:hidden flex absolute top-1/2 right-6 -translate-y-1/2 z-100">
          <TriggerMobileNavbar />
        </div>
      </div>
    </header>
  );
}
