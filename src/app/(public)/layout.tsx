import Navbar from "@/components/customComponents/Navbar";
import { ReactNode } from "react";

export default function PublicLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
