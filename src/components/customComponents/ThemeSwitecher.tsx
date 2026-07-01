/** biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { cn } from "@/lib/utils";
import { MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { startTransition, useEffect, useState } from "react";
import { Switch } from "../ui/switch";

export const ThemeSwitcher = ({ className }: { className?: string }) => {
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => startTransition(() => setIsMounted(true)), []);

  if (!isMounted) return null;

  return (
    <div
      className={cn(
        "flex items-center space-x-2 border rounded-3xl p-2",
        className,
      )}>
      {theme === "light" ? (
        <Sun className="size-4 text-muted-foreground" />
      ) : (
        <MoonIcon className="size-4 text-muted-foreground" />
      )}
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="hover:cursor-pointer"
      />
    </div>
  );
};
