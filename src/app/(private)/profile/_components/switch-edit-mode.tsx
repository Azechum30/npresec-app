"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ShieldQuestion } from "lucide-react";
import { useEffect, useState, startTransition } from "react";

type SwitchEditModeProps = {
  canEdit?: boolean;
  setCanEdit?: (canEdit: boolean) => void;
};

export const SwitchEditMode = ({
  canEdit,
  setCanEdit,
}: SwitchEditModeProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => startTransition(() => setIsMounted(true)), []);

  if (!isMounted) return null; // Prevents hydration mismatch
  return (
    <div className="flex gap-1 items-center">
      <Label className="text-xs text-muted-foreground">
        Enable Editing{" "}
        <ShieldQuestion className="size-4" color={canEdit ? "green" : "gray"} />
      </Label>
      <Switch
        checked={canEdit === true}
        onCheckedChange={(value) => setCanEdit?.(value)}
        className="hover:cursor-pointer"
      />
    </div>
  );
};
