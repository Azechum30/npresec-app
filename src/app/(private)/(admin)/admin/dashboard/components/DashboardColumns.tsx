import { ColumnDef } from "@tanstack/react-table";
import { DashboardData } from "@/app/(private)/(admin)/admin/dashboard/actions/dashboard-data";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";

type ColumnsType = Pick<
  DashboardData,
  "recentStudents"
>["recentStudents"][number];

export const columns = [
  {
    header: "Avatar",
    cell: ({ row }) => {
      const photoUrl = row.original.photoUrl;
      return (
        <Image
          src={photoUrl ? photoUrl : "/no-avatar.jpg"}
          alt="Avatar"
          width={20}
          height={40}
          className="size-8 rounded-full object-cover object-center"
        />
      );
    },
  },
  {
    header: "Student ID",
    accessorFn: (row) => row.studentNumber,
  },
  {
    header: "First Name",
    accessorFn: (row) => row.firstName,
  },
  {
    header: "Last Name",
    accessorFn: (row) => row.lastName,
  },
  {
    header: "Class",
    accessorFn: (row) => row.className,
  },
  {
    header: "Department",
    accessorFn: (row) => row.departmentName,
  },
  {
    header: "Enrolled",
    cell: ({ row }) => {
      const formattedDate = formatDistanceToNow(
        new Date(row.original.dateEnrolled),
        {
          addSuffix: true,
        }
      );

      return <span className="text-blue-500">{formattedDate.toString()}</span>;
    },
  },
  {
    header: "YearGroup",
    accessorFn: (row) => row.yearGroup,
  },
] satisfies ColumnDef<ColumnsType>[];
