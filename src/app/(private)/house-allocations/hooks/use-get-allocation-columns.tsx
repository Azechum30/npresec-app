/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { AvatarComponent } from "@/components/customComponents/avatar-component";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { toProperCase } from "@/lib/to-proper-case";
import type { TAllocations } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteAllocationMutationFn } from "../_actions/mutations";

export const useGetAllocationsColumns = () => {
  const { mutateAsync, isPending } = useDeleteAllocationMutationFn();
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections table={table} isHeader />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => (
        <AvatarComponent
          image={row.original.student.user?.image as string}
          fallback={`${row.original.student.lastName} ${row.original.student.firstName}`}
        />
      ),
    },
    {
      header: "Student ID",
      accessorFn: (row) => row.student.studentNumber,
    },
    {
      header: "Last Name",
      accessorFn: (row) => row.student.lastName,
    },
    {
      header: "First Name",
      accessorFn: (row) => row.student.firstName,
    },
    {
      header: "Gender",
      accessorFn: (row) => toProperCase(row.student.gender),
    },
    {
      header: "Level",
      accessorFn: (row) => row.student.currentLevel.replace(/[_-]/g, " "),
    },
    {
      header: "House",
      accessorFn: (row) => row.house.name,
    },
    {
      header: "Status",
      accessorFn: (row) => row.status,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          onDelete={async () => {
            await Promise.try(async () => {
              await mutateAsync(row.original.id);
            });
          }}
          dialogId="edit-allocation"
          isPending={isPending}
        />
      ),

      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<TAllocations>[];
};
