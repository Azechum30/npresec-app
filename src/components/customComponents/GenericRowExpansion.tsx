/**biome-ignore-all assist/source/organizeImports: reason */

import type { ComponentProps } from "@/lib/constants";
import { Minus, Plus } from "lucide-react";
import type { FC } from "react";
import { Button } from "../ui/button";

export const GenericRowExpansion: FC<ComponentProps> = ({
  table,
  isHeader,
  row,
}) => {
  return (
    <Button
      variant="ghost"
      type="button"
      aria-label="expand-student-row"
      size="sm"
      onClick={
        isHeader
          ? () => table?.toggleAllRowsExpanded()
          : () => row?.toggleExpanded()
      }>
      {(isHeader && table?.getIsAllRowsExpanded()) ||
      (!isHeader && row?.getIsExpanded()) ? (
        <Minus className="size-5" />
      ) : (
        <Plus className="size-5" />
      )}
    </Button>
  );
};
