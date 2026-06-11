import { ReactNode } from "react";
import { RenderNotification } from "./_components/render-notifications";

type OnlineAdmissionLayoutProps = {
  children: ReactNode;
};

export default function OnlineAdmissionLayout({
  children,
}: OnlineAdmissionLayoutProps) {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-linear-120 from-primary/5 via-secondary/8 to-accent/10 print:hidden">
        <div className="absolute -top-52 -right-52 size-130 rounded-full bg-primary/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-44 -left-44 size-105 rounded-full bg-primary/8 blur-3xl animate-pulse" />
        <div className="absolute top-1/3 left-1/4 size-80 rounded-full bg-accent/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 size-56 rounded-full bg-secondary/25 blur-2xl animate-pulse" />
      </div>

      <div className="relative w-full min-h-screen print:min-h-0 flex flex-col items-center justify-start py-10 px-4 sm:justify-center">
        {children}
      </div>

      <RenderNotification />
    </>
  );
}
