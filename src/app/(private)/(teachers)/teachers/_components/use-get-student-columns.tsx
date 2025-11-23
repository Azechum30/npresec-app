import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { StudentResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import Image from "next/image";

export const useGetStudentColumns = () => {
  return [
    {
      header: "Avatar",
      cell: ({ row }) => {
        const { picture } = row.original.user ?? {};
        const isValid = picture
          ? picture.startsWith("http") ||
            picture.startsWith("https") ||
            picture.startsWith("/")
          : false;
        const url = isValid ? (picture as string) : "/no-avatar.jpg";

        return (
          <div className="size-8 rounded-full border p-1 flex items-center justify-center">
            <Image
              src={url}
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
      accessorFn: (row) => moment(row.birthDate).format("DD-MM-YY"),
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
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableResizing: false,
      enableGrouping: false,
    },
  ] satisfies ColumnDef<StudentResponseType>[];
};
