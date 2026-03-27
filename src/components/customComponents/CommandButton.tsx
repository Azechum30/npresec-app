"use client";
import { useOpenCommandPalette } from "@/hooks/use-open-command-palette";
import { useOpenSidebar } from "@/hooks/use-open-sidebar";
import { cn } from "@/lib/utils";
import { Command } from "lucide-react";
import { Button } from "../ui/button";

export default function CommandButton() {
  const { onOpen } = useOpenCommandPalette();
  const { open } = useOpenSidebar();

  return (
    <Button
      variant="outline"
      onClick={onOpen}
      className={cn(
        "relative md:w-auto w-75 lg:w-75 py-2 flex items-center justify-between text-muted-foreground hover:text-inherit",
        open && "w-57.5 md:w-auto lg:w-75",
      )}>
      <span>Search the system...</span>
      <span
        className={cn(
          `md:hidden absolute top-1/2 right-1 -translate-y-1/2 z-40 flex lg:flex items-center text-xs bg-gray-300 hover:bg-inherit dark:bg-gray-700/75 dark:hover:bg-inherit rounded-md px-2 py-1`,
        )}>
        <Command className="size-1 mr-1" />
        <span>K</span>
      </span>
    </Button>
  );
}
