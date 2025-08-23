import { ChevronDown, Columns3 } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { Table } from "@tanstack/react-table";

export default function ColumnVisibility({
  table,
  className,
}: {
  table: Table<any>;
  className?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className={cn("max-w-38", className)}>
          <Columns3 className="size-4" /> Columns{" "}
          <ChevronDown className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="min-w-32">
        <DropdownMenuLabel className="text-xs">Column List</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column: any, index: number) => (
            <Fragment key={column.id}>
              <DropdownMenuCheckboxItem
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
                className="w-full hover:cursor-pointer text-left capitalize">
                {column.id}
              </DropdownMenuCheckboxItem>
              {index + 1 < table.getAllColumns().length - 2 && (
                <DropdownMenuSeparator />
              )}
            </Fragment>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
