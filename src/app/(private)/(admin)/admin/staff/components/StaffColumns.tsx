import { StaffResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

import { GenericActions } from "@/components/customComponents/GenericActions";
import { useDeleteStaff } from "../hooks/use-delete-staff";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { GenericColumnSorting } from "@/components/customComponents/GenericColumnSorting";
import Image from "next/image";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";

export const useGetStaffColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();

  const { deleteStaff, isPending } = useDeleteStaff();
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
    {
      header: "EmployeeID",
      accessorKey: "employeeId",
    },
    {
      header: "Firstname",
      accessorKey: "firstName",
    },

    {
      header: "Lastname",
      accessorKey: "lastName",
    },
    {
      header: "BirthDate",
      accessorKey: "birthDate",

      cell: ({ row }) => {
        return formatDate(row.original.birthDate);
      },
    },
    {
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Department",
      accessorKey: "department.name",
      cell: ({ row }) =>
        row.original.department?.name ? row.original.department.name : "",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            dialogId="editStaff"
            row={row}
            onDelete={deleteStaff}
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
