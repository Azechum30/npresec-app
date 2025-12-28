import Navbar from "@/components/customComponents/Navbar";
import { ReactNode } from "react";
import { Footer } from "@/app/(public)/_components/Footer";
import { MobileNavbar } from "@/components/customComponents/MobileNavbar";

export default function PublicLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <MobileNavbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
