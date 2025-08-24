import Navbar from "@/components/customComponents/Navbar";
import { ReactNode } from "react";
import { Footer } from "@/app/(public)/_components/Footer";
import { MobileNavbar } from "@/components/customComponents/MobileNavbar";
import SessionProvider from "@/components/customComponents/SessionProvider";
import { getAuthUser } from "@/lib/getAuthUser";
import { SessionWrapper } from "@/components/customComponents/SessionWrapper";

export default async function PublicLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const user = await getAuthUser();

  return (
    <SessionWrapper user={user ? user : null}>
      <div>
        <Navbar />
        <MobileNavbar />
        <main>{children}</main>
        <Footer />
      </div>
    </SessionWrapper>
  );
}
