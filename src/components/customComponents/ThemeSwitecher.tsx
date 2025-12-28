"use client";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { useEffect, useState, startTransition } from "react";

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => startTransition(() => setIsMounted(true)), [isMounted]);

  if (!isMounted) return null; // Prevents hydration mismatch

  return (
    <div className="flex items-center space-x-2">
      <Label className="text-xs text-muted-foreground">Switch Theme</Label>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="hover:cursor-pointer"
      />
    </div>
  );
};
