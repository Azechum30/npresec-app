import { TeacherResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";

import { GenericActions } from "@/components/customComponents/GenericActions";
import { useDeleteTeacher } from "../hooks/use-delete-teacher";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { GenericColumnSorting } from "@/components/customComponents/GenericColumnSorting";
import Image from "next/image";

export const useGetTeacherColumns = () => {
  const { deleteTeacher } = useDeleteTeacher();
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
      cell:({row})=>{
        const url = row.original.user?.picture;
        return <div className="rounded-full border border-orange-300 dark:border-orange-200 flex items-center justify-center size-8">
          <Image
              src={url ? url : '/no-avatar.jpg'}
              alt="/Avatar"
              width={30}
              height={30}
              className="rounded-full object-cover size-6 object-top"
          />
        </div>
      }
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
        return moment(row.original.birthDate).format("DD/MM/YY");
      },
    },
    {
      header: "Gender",
      accessorKey: "gender",
    },
    {
      header: "Department",
      accessorKey: "departmentId",
      cell: ({ row }) => {
        return row.original.department?.name;
      },
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
          />
        );
      },
      enableColumnFilter: false,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },
    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,
      enableGlobalFilter: false,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<TeacherResponseType>[];
};
