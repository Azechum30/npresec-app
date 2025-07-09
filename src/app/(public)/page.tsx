import Link from "next/link";

export const metadata = {
  title: "Home",
};

export default function Home() {
  const Links = [
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
    {
      title: "Sign into your account",
      href: "/sign-in",
    },
  ];
  return <div>Home Page</div>;
}
