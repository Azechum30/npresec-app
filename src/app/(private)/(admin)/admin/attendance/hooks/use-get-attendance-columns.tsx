import { ColumnDef } from "@tanstack/react-table";
import { AttendanceResponseType } from "@/lib/types";
import Image from "next/image";
import { cn } from "@/lib/utils";
import moment from "moment";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useDeleteSingleAttendance } from "@/app/(private)/(admin)/admin/attendance/hooks/use-delete-single-attendance";

export const useGetAttendanceColumns = () => {
  const { handleDeleteSingleAttendance, isPending } =
    useDeleteSingleAttendance();
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
          <div className="rounded-full border border-blue-300 dark:border-blue-200 size-8 flex justify-center items-center mx-auto">
            <Image
              src={url ? url : "/no-avatar.jpg"}
              alt="Avatar"
              width={20}
              height={40}
              className="rounded-full size-6 object-cover object-top"
            />
          </div>
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
                    : "bg-blue-200 dark:bg-blue-950 rounded-md px-4 py-2 text-xs"
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
          onDelete={handleDeleteSingleAttendance}
          secondaryKey="id"
          dialogId="editAttendance"
          isPending={isPending}
        />
      ),
      enablePinning: false,
      enableHiding: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<AttendanceResponseType>[];
};
