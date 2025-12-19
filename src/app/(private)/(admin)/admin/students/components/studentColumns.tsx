import { StudentResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { useDeleteStudent } from "../hooks/use-delete-student";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import Image from "next/image";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";

export const useGetColumns = () => {
  const { deletestudent } = useDeleteStudent();
  const { formatDate } = useUserPreferredDateFormat();
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
        const { image } = row.original.user ?? {};
        const isValid = image
          ? image.startsWith("http") ||
            image.startsWith("https") ||
            image.startsWith("/")
          : false;
        const url = isValid ? image : "/no-avatar.jpg";

        return (
          <div className="size-8 rounded-full border border-orange-500 dark:border-orange-200 flex items-center justify-center">
            <Image
              src={url ? url : "/no-avatar.jpg"}
              alt="Avatar"
              width={20}
              height={20}
              className="size-6 rounded-full object-cover object-top"
            />
          </div>
        );
      },
    },
    {
      header: "ID",
      accessorFn: (row) => row.studentNumber,
    },
    {
      header: "FirstName",
      accessorFn: (row) => row.firstName,
    },
    {
      header: "LastName",
      accessorFn: (row) => row.lastName,
    },
    {
      header: "BirthDate",
      accessorFn: (row) => formatDate(row.birthDate),
    },
    {
      header: "Gender",
      accessorFn: (row) => row.gender,
    },
    {
      header: "CurrentLevel",
      accessorFn: (row) => row.currentLevel.split("_").join(" "),
    },
    {
      header: "Class",
      accessorFn: (row) =>
        row.currentClass?.name ? row.currentClass.name : "",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions<StudentResponseType>
          row={row}
          onDelete={deletestudent}
          secondaryKey="studentNumber"
        />
      ),
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },

    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,

      enableHiding: false,
      enableColumnFilter: false,
      enableSorting: false,
      enablePinning: false,
      enableGrouping: false,
      enableGlobalFilter: false,
      enableResizing: false,
    },
  ] satisfies ColumnDef<StudentResponseType>[];
};
