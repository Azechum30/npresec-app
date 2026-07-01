/** biome-ignore-all assist/source/organizeImports:reason */
import { cn } from "@/lib/utils";
import type { Table } from "@tanstack/react-table";
import { ChevronDown, LayoutDashboard } from "lucide-react";
import { Fragment } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function ColumnVisibility<T>({
  table,
  className,
}: {
  table: Table<T>;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn("max-w-38 border-primary", className)}>
          <LayoutDashboard className="size-4" /> Columns{" "}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-32">
        <DropdownMenuLabel className="text-xs">
          Column Headers
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column, index: number) => (
            <Fragment key={column.id}>
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                className="w-full hover:cursor-pointer text-left capitalize">
                {column.id}
              </DropdownMenuCheckboxItem>
              {index + 1 < table.getAllColumns().length - 1 && (
                <DropdownMenuSeparator />
              )}
            </Fragment>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
