import { FC } from "react";
import { Button } from "../ui/button";
import { Minus, Plus } from "lucide-react";
import { ComponentProps } from "@/lib/constants";

export const GenericRowExpansion: FC<ComponentProps> = ({
  table,
  isHeader,
  row,
}) => {
  return (
    <>
      <Button
        variant="ghost"
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
    </>
  );
};
