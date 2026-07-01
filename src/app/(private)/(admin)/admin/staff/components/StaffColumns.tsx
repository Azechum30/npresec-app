/** biome-ignore-all assist/source/organizeImports: reason */
import type { StaffResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";

import { AvatarComponent } from "@/components/customComponents/avatar-component";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import { useDeleteStaffMutationFn } from "../actions/mutations";

export const useGetStaffColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();

  const { isPending, mutateAsync } = useDeleteStaffMutationFn();

  const handleDelete = async (id: string) => {
    Promise.try(async () => mutateAsync(id));
  };
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,

      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => (
        <AvatarComponent
          image={row.original.user?.image ?? undefined}
          fallback={`${row.original.lastName} ${row.original.firstName}`}
        />
      ),
    },
    {
      header: "Lastname",
      accessorKey: "lastName",
    },
    {
      header: "Firstname",
      accessorKey: "firstName",
    },
    {
      header: "Othernames",
      accessorKey: "middleName",
    },

    {
      header: "BirthDate",
      accessorFn: (row) => formatDate(row.birthDate),
    },
    {
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Department",
      accessorKey: "department.name",
      cell: (info) => info.getValue(),
      filterFn: fuzzyFilter,
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            dialogId="edit-staff"
            row={row}
            onDelete={handleDelete}
            secondaryKey="employeeId"
            isPending={isPending}
          />
        );
      },
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },
    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<StaffResponseType>[];
};
