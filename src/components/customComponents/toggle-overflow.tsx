"use client";

import { useOpenSidebar } from "@/hooks/use-open-sidebar";
import { useEffect } from "react";

export const ToggleOverflow = () => {
  const { open } = useOpenSidebar();

  useEffect(() => {
    const isSmallScreenSize = window.matchMedia("max-width: 768px").matches;

    if (open && isSmallScreenSize) {
      document.body.style.overflow = "hidden";
    }
    {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return null;
};
