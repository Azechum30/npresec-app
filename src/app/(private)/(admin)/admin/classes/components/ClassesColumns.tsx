import { Button } from "@/components/ui/button";
import { ClassesResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowDownUp, ArrowUpDown, Minus, Plus } from "lucide-react";
import { useDeleteClass } from "../hooks/use-delete-class";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";

export const useGetClassesColumns = () => {
  const { deleteclass } = useDeleteClass();
  const { formatDate } = useUserPreferredDateFormat();
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
      header: "ClassCode",
      accessorKey: "code",
    },
    {
      header: "Class Title",
      accessorKey: "name",
    },
    {
      header: "Department",
      accessorKey: "departmentId",
      cell: ({ row }) => {
        return row.original.department ? row.original.department?.name : "";
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
        return formatDate(row.original.createdAt);
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            row={row}
            onDelete={deleteclass}
            secondaryKey="id"
            dialogId="editClass"
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
