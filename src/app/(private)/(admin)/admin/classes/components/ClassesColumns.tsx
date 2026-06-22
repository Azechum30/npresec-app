/** biome-ignore-all assist/source/organizeImports:reason */

import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Button } from "@/components/ui/button";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import type { ClassesResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { useDeleteClassMutationFn } from "../actions/mutations";

export const useGetClassesColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();
  const { mutateAsync, isPending } = useDeleteClassMutationFn();

  const handleDelete = async (id: string) => {
    Promise.try(async () => await mutateAsync({ id }));
  };
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
            onDelete={handleDelete}
            secondaryKey="id"
            dialogId="edit-class"
            isPending={isPending}
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
