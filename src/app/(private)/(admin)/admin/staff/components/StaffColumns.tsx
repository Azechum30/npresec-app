/** biome-ignore-all assist/source/organizeImports: reason */
import type { StaffResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";

import { GenericActions } from "@/components/customComponents/GenericActions";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import Image from "next/image";
import { useDeleteStaffMutationFn } from "../actions/mutations";

export const useGetStaffColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();

  const { isPending, mutateAsync } = useDeleteStaffMutationFn();

  const handleDelete = async (id: string) => {
    Promise.try(async () => mutateAsync(id));
  };
  return [
    {
      id: "visibility",
      header: ({ table }) => <RowSelections isHeader table={table} />,

      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => {
        const candidate = row.original.user?.image ?? "";
        const isValid =
          typeof candidate === "string" &&
          (candidate.startsWith("http://") ||
            candidate.startsWith("https://") ||
            candidate.startsWith("/"));
        const src = isValid ? candidate : "/no-avatar.jpg";
        return (
          <div className="rounded-full border border-accent flex items-center justify-center size-8">
            <Image
              src={src}
              alt="Avatar"
              width={30}
              height={30}
              className="rounded-full object-cover size-6 object-top"
            />
          </div>
        );
      },
    },
    // {
    //   header: "EmployeeID",
    //   accessorKey: "employeeId",
    // },
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
