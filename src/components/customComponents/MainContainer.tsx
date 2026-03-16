import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import BreadCrumbNav from "./BreadCrumbNav";
import CommandButton from "./CommandButton";
import CommandPalette from "./CommandPalette";
import SidebarOpenButton from "./SidebarOpenButton";
import { Timer } from "./Timer";

export default function MainContainer({ children }: { children: ReactNode }) {
  return (
    <div className={cn("content")}>
      <div
        className={cn(
          "w-full sticky top-0 left-0 z-30 h-14 px-4 md:px-10 border-b bg-inherit backdrop-blur-md flex flex-row-reverse md:flex-row items-center justify-between gap-2"
        )}>
        <div className=" flex items-center gap-2">
          <SidebarOpenButton />
          <BreadCrumbNav />
        </div>
        <CommandButton />
        <Timer />
      </div>
      <CommandPalette />

      <div className="px-4 md:px-10 py-4 text-sm">{children}</div>
    </div>
  );
}
