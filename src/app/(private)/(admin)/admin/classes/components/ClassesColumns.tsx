/** biome-ignore-all assist/source/organizeImports:reason */

import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Button } from "@/components/ui/button";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import type { ClassesResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { useDeleteClassMutationFn } from "../actions/mutations";

export const useGetClassesColumns = () => {
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
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Programme",
      accessorKey: "departmentId",
      cell: ({ row }) => {
        return row.original.department ? row.original.department?.name : "";
      },
    },
    {
      id: "subjects",
      header: () => <div className="text-center">Subjects</div>,
      accessorKey: "_count.courses",
      cell: ({ row }) => (
        <div className="text-center">{row.original._count.courses}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      id: "quota",
      header: () => <div className="text-center">Quota</div>,
      accessorKey: "maxCapacity",
      cell: ({ row }) => (
        <div className="text-center">{row.original.maxCapacity}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      id: "allocated",
      header: () => <div className="text-center">Allocated</div>,
      accessorKey: "currentEnrollment",
      cell: ({ row }) => (
        <div className="text-center">{row.original.currentEnrollment}</div>
      ),
      filterFn: fuzzyFilter,
    },
    {
      id: "remaining",
      header: () => <div className="text-center">Remaining</div>,
      cell: ({ row }) => (
        <div className="text-center text-primary">
          {row.original.maxCapacity
            ? row.original.maxCapacity - row.original.currentEnrollment
            : 0}
        </div>
      ),
      filterFn: fuzzyFilter,
    },

    {
      header: "Next Class",
      accessorFn: (row) => row.nextClass?.name ?? "Not Set",
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
