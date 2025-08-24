"use client";

import { Menu } from "lucide-react";
import { Button } from "../ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";

export const TriggerMobileNavbar = () => {
  const { onOpen } = useGenericDialog();

  return (
    <Button variant="ghost" size="icon" onClick={() => onOpen("mobile-nav")}>
      <Menu className="size-6" />
    </Button>
  );
};
