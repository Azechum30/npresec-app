import { Button } from "@/components/ui/button";
import { ClassesResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUp, ArrowUpDown, Minus, Plus } from "lucide-react";
import moment from "moment";
import { useDeleteClass } from "../hooks/use-delete-class";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";

export const useGetClassesColumns = () => {
  const { deleteclass } = useDeleteClass();
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },
    {
      header: ({ column }) => {
        return (
          <Button
            className="justify-start text-sm"
            variant={column.getIsSorted() ? "secondary" : "ghost"}
            size="sm"
            onClick={() => column.toggleSorting()}>
            <span>ClassCode</span>
            {column.getIsSorted() ? (
              <ArrowUpDown className="size-5" />
            ) : (
              <ArrowDownUp className="size-5" />
            )}
          </Button>
        );
      },
      accessorKey: "code",
    },
    {
      header: ({ column }) => {
        return (
          <Button
            className="justify-start text-sm"
            variant={column.getIsSorted() ? "secondary" : "ghost"}
            size="sm"
            onClick={() => column.toggleSorting()}>
            <span>ClassName</span>
            {column.getIsSorted() ? (
              <ArrowUpDown className="size-5" />
            ) : (
              <ArrowDownUp className="size-5" />
            )}
          </Button>
        );
      },
      accessorKey: "name",
    },
    {
      header: "Department",
      accessorKey: "departmentId",
      cell: ({ row }) => {
        return `${
          row.original.department ? row.original.department?.name : ""
        }`;
      },
    },
    {
      header: "YearLevel",
      accessorKey: "level",
      cell: ({ row }) => {
        return row.original.level.split("_").join(" ");
      },
    },
    {
      header: "CreatedAt",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return moment(row.original.createdAt).format("DD/MM/YY");
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            row={row}
            onDelete={deleteclass}
            secondaryKey="code"
            dialogId="editClasses"
          />
        );
      },
    },

    {
      id: "expansion",
      header: ({ table }) => {
        return (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => table.toggleAllRowsExpanded()}>
            {table.getIsAllRowsExpanded() ? (
              <Minus className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => row.toggleExpanded()}>
            {row.getIsExpanded() ? (
              <Minus className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
          </Button>
        );
      },
    },
  ] satisfies ColumnDef<ClassesResponseType>[];
};
