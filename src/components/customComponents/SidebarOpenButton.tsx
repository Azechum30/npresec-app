/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useOpenSidebar } from "@/hooks/use-open-sidebar";
import { SidebarClose, SidebarOpen } from "lucide-react";
import { Button } from "../ui/button";

export default function SidebarOpenButton({
  className,
}: {
  className?: string;
}) {
  const { open, setOpen } = useOpenSidebar();

  const handleOpen = (value: boolean) => {
    setOpen(value);
  };
  return (
    <Button
      onClick={() => handleOpen(open)}
      variant="outline"
      type="button"
      role="navigation"
      aria-label="open-side-bar"
      size="icon"
      className={className}>
      {open ? (
        <SidebarClose className="sise-6" />
      ) : (
        <SidebarOpen className="sise-6" />
      )}
    </Button>
  );
}
