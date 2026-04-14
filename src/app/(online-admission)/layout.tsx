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
      <div className=" relative bg-linear-120 from-primary/5 via-secondary/10 to-accent/15 w-full h-screen print:h-auto flex justify-center items-center ">
        {children}
        <div className="size-20 rounded-full bg-primary blur-3xl animate-pulse absolute bottom-16 left-56 -z-10" />
        <div className="size-20 rounded-full bg-primary blur-3xl animate-pulse absolute top-14 right-56 -z-10" />
      </div>
      <RenderNotification />
    </>
  );
}
