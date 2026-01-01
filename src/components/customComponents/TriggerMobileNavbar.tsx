"use client";

import { useState } from "react";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

export const TriggerMobileNavbar = () => {
  const { onOpen, dialogs } = useGenericDialog();
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const isOpen = dialogs["mobile-nav"];

  useGSAP(() => {
    // Animate menu icon rotation when opened/closed
    gsap.to(".mobile-menu-icon", {
      rotation: isOpen ? 180 : 0,
      duration: 0.3,
      ease: "power2.out",
    });

    // Pulse animation on press
    if (isPressed) {
      gsap.fromTo(
        ".mobile-nav-trigger",
        { scale: 1 },
        { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 },
      );
    }
  }, [isOpen, isPressed]);

  const handleClick = () => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 200);
    onOpen("mobile-nav");
  };

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div
        className={`
          absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl blur-lg transition-opacity duration-300 pointer-events-none
          ${isHovered ? "opacity-100 scale-110" : "opacity-0 scale-100"}
        `}
      />

      {/* Sparkle decoration */}
      <div
        className={`
          absolute -top-1 -right-1 transition-all duration-300 pointer-events-none
          ${isHovered ? "opacity-100 scale-100" : "opacity-0 scale-0"}
        `}
      >
        <Sparkles className="w-3 h-3 text-primary" />
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`
          mobile-nav-trigger relative w-11 h-11 rounded-xl transition-all duration-300
          bg-background/60 backdrop-blur-md border border-border/50
          hover:bg-background/80 hover:border-primary/30 hover:shadow-lg
          active:scale-95
          ${isOpen ? "bg-primary/10 border-primary/30" : ""}
        `}
      >
        {/* Gradient overlay */}
        <div
          className={`
            absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl transition-opacity duration-300
            ${isHovered || isOpen ? "opacity-100" : "opacity-0"}
          `}
        />

        {/* Menu Icon */}
        <div className="mobile-menu-icon relative z-10 transition-all duration-300">
          {isOpen ? (
            <X
              className={`
                w-5 h-5 transition-all duration-300
                ${isOpen ? "text-primary" : "text-foreground"}
              `}
            />
          ) : (
            <Menu
              className={`
                w-5 h-5 transition-all duration-300
                ${isHovered ? "text-primary" : "text-foreground"}
              `}
            />
          )}
        </div>

        {/* Active indicator */}
        {isOpen && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full" />
        )}
      </Button>

      {/* Ripple effect on click */}
      {isPressed && (
        <div className="absolute inset-0 rounded-xl border-2 border-primary/50 animate-ping pointer-events-none" />
      )}
    </div>
  );
};
