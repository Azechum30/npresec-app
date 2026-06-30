/** biome-ignore-all assist/source/organizeImports: reason */
import { Footer } from "@/app/(public)/_components/Footer";
import { MobileNavbar } from "@/components/customComponents/MobileNavbar";
import Navbar from "@/components/customComponents/Navbar";
import type { ReactNode } from "react";

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
