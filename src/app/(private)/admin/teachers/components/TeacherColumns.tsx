import { TeacherResponseType } from "@/lib/types";
import { ColumnDef, Row } from "@tanstack/react-table";

import { GenericActions } from "@/components/customComponents/GenericActions";
import { useDeleteTeacher } from "../hooks/use-delete-teacher";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { GenericColumnSorting } from "@/components/customComponents/GenericColumnSorting";
import Image from "next/image";
import { formatDate } from "@/lib/format-date";
import { DateFormatType } from "@/lib/validation";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";

export const useGetTeacherColumns = () => {
  const userPreferredDateFormat = useUserPreferredDateFormat();

  const { deleteTeacher, isPending } = useDeleteTeacher();
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
        const candidate = row.original.user?.picture ?? "";
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
      header: ({ column }) => (
        <GenericColumnSorting isHeader column={column} title="FirstName" />
      ),
      accessorKey: "firstName",
    },

    {
      header: ({ column }) => (
        <GenericColumnSorting isHeader column={column} title="LastName" />
      ),
      accessorKey: "lastName",
    },
    {
      header: "BirthDate",
      accessorKey: "birthDate",

      cell: ({ row }) => {
        return formatDate(
          row.original.birthDate,
          userPreferredDateFormat as DateFormatType
        );
      },
    },
    {
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Department",
      accessorKey: "department.name",
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            dialogId="editTeacher"
            row={row}
            onDelete={deleteTeacher}
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
  ] satisfies ColumnDef<TeacherResponseType>[];
};
