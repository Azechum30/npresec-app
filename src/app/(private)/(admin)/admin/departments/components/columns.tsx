/** biome-ignore-all assist/source/organizeImports: reason */

import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Button } from "@/components/ui/button";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import type { DepartmentResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { useDeleteDepartmentMutationFn } from "../actions/mutations";

export const useGetDepartmentColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();
  const { mutateAsync, isPending } = useDeleteDepartmentMutationFn();

  const handleDelete = (id: string) =>
    Promise.try(async () => {
      await mutateAsync(id);
    });

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
      header: "Code",
      accessorKey: "code",
    },
    {
      header: "Name",
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
            onDelete={handleDelete}
            secondaryKey="code"
            dialogId="edit-department"
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
