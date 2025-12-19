import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Minus, Plus } from "lucide-react";
import { DepartmentResponseType } from "@/lib/types";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { useDeleteDepartment } from "../hooks/use-delete-department";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";

export const useGetDepartmentColumns = () => {
  const { deletedepartment, isPending } = useDeleteDepartment();

  const { formatDate } = useUserPreferredDateFormat();

  return [
    {
      id: "select",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections row={row} isHeader={false} />,
      enableHiding: false,
      enableColumnFilter: false,
      enablePinning: false,
    },

    {
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="capitalize text-sm justify-start text-left"
            size="sm"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            <ArrowUpDown className="size-4" />
            {column.id}
          </Button>
        );
      },
      accessorKey: "code",
    },
    {
      header: ({ column }) => {
        return (
          <Button
            size="sm"
            variant="ghost"
            className="capitalize text-sm"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }>
            <ArrowUpDown className="size-4" />
            {column.id}
          </Button>
        );
      },
      accessorKey: "name",
    },
    {
      header: "CreatedAt",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        return formatDate(row.original.createdAt);
      },
    },
    {
      header: "Head",
      accessorKey: "headId",
      cell: ({ row }) => {
        return (
          (row.original.head?.firstName ||
            row.original.head?.middleName ||
            row.original.head?.lastName) &&
          `${row.original.head?.firstName} ${row.original.head?.middleName} ${row.original.head?.lastName}`
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            row={row}
            onDelete={deletedepartment}
            secondaryKey="code"
            dialogId="editDepartment"
            isPending={isPending}
          />
        );
      },
    },
    {
      header: ({ table }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.toggleAllRowsExpanded()}>
            {table.getIsAllRowsExpanded() ? (
              <Minus className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
          </Button>
        );
      },
      id: "expand",
      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            onClick={() => row.toggleExpanded()}>
            {row.getIsExpanded() ? (
              <Minus className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
          </Button>
        );
      },
      enableHiding: false,
      enablePinning: false,
      enableColumnFilter: false,
    },
  ] satisfies ColumnDef<DepartmentResponseType>[];
};
