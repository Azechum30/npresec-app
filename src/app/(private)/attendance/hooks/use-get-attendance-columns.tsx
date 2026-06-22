/**biome-ignore-all assist/source/organizeImports: reason */

import { AvatarComponent } from "@/components/customComponents/avatar-component";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import type { AttendanceResponseType } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { useDeleteAttendanceMutationFn } from "../actions/mutations";

export const useGetAttendanceColumns = () => {
  const { isPending, mutateAsync } = useDeleteAttendanceMutationFn();
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections table={table} isHeader />,
      cell: ({ row }) => <RowSelections row={row} isHeader={false} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => {
        const url = row.original.student.user?.image;
        return (
          <AvatarComponent
            image={url ?? undefined}
            fallback={`${row.original.student.lastName} ${row.original.student.firstName}`}
          />
        );
      },
    },
    {
      header: "Full Name",
      accessorFn: (row) => `${row.student.lastName} ${row.student.firstName}`,
    },
    {
      header: "Date",
      accessorFn: (row) => moment(row.date).format("DD-MM-YY"),
    },
    {
      header: "AcademicYear",
      accessorFn: (row) => row.academicYear,
    },
    {
      header: "Semester",
      accessorFn: (row) => row.semester,
    },
    {
      header: "Class",
      accessorFn: (row) => row.class.name,
    },
    {
      header: "Status",
      cell: ({ row }) => {
        return (
          <span
            className={cn(
              row.original.status === "Present"
                ? "bg-green-200 dark:bg-green-950 rounded-md px-4  py-2 text-xs"
                : row.original.status === "Absent"
                  ? "bg-red-200 dark:bg-red-950 rounded-md px-4  py-2 text-xs"
                  : row.original.status === "Late"
                    ? "bg-orange-200 dark:bg-orange-950 rounded-md px-4  py-2 text-xs"
                    : "bg-blue-200 dark:bg-blue-950 rounded-md px-4 py-2 text-xs",
            )}>
            {row.original.status.toString()}
          </span>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          onDelete={async () => {
            Promise.try(async () => await mutateAsync(row.original.id));
          }}
          secondaryKey="id"
          dialogId="edit-attendance"
          isPending={isPending}
        />
      ),
      enablePinning: false,
      enableHiding: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<AttendanceResponseType>[];
};
