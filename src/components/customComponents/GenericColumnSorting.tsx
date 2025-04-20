import { ComponentProps } from "@/lib/constants";
import { FC } from "react";
import { Button } from "../ui/button";
import { ArrowDownUp, ArrowUpDown } from "lucide-react";

export const GenericColumnSorting: FC<ComponentProps> = ({
  isHeader,
  column,
  title,
}) => {
  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column?.toggleSorting()}
        className="group">
        <span>{title}</span>
        {column?.getIsSorted() ? (
          <span className="size-6 flex items-center justify-center">
            <ArrowUpDown className="size-5 transition-all duration-250" />
          </span>
        ) : (
          <span className="size-6 flex items-center justify-center">
            <ArrowDownUp className="size-5 transition-all duration-250" />
          </span>
        )}
      </Button>
    </>
  );
};
