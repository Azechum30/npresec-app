/** biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { MoonIcon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { startTransition, useEffect, useState } from "react";
import { Switch } from "../ui/switch";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => startTransition(() => setIsMounted(true)), []);

  if (!isMounted) return null; // Prevents hydration mismatch

  return (
    <div className="flex items-center space-x-2 border rounded-3xl p-2">
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
