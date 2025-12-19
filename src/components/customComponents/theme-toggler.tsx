"use client";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { updateThemeAction } from "@/app/(private)/profile/_actions/update-theme-action";
import { useTransition } from "react";

async function saveThemeToDB(theme: "system" | "light" | "dark") {
  try {
    // Save to database without revalidation to prevent flicker
    await fetch("/api/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme }),
    });
  } catch (error) {
    console.error("Failed to save theme:", error);
  }
}

export default function ThemeToggler({ className }: { className: string }) {
  const { setTheme, theme } = useTheme();
  const [isPending, startTransition] = useTransition();

  const handleThemeChange = (newTheme: "system" | "light" | "dark") => {
    setTheme(newTheme);
    // Save to database asynchronously without blocking UI
    startTransition(() => saveThemeToDB(newTheme));
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="size-6">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center">
          <DropdownMenuLabel>Themes</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => handleThemeChange("light")}>
            <Sun className="h-4 w-4 mr-2" />
            Light
            {theme === "light" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("dark")}>
            <Moon className="h-4 w-4 mr-2" />
            Dark
            {theme === "dark" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleThemeChange("system")}>
            <span className="h-4 w-4 mr-2 flex items-center justify-center">💻</span>
            System
            {theme === "system" && <span className="ml-auto">✓</span>}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
