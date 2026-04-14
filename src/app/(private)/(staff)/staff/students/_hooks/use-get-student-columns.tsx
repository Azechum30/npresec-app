import { fuzzyFilter } from "@/lib/fuzzyFilter";
import { StudentResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

export const useGetStudentColumns = () => {
  return [
    {
      header: "Avatar",
      cell: ({ row }) => {
        const { image } = row.original.user ?? {};
        const isValid = image
          ? image.startsWith("http") ||
            image.startsWith("https") ||
            image.startsWith("/")
          : false;
        const url = isValid ? (image as string) : "/no-avatar.jpg";

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
      header: "Gender",
      accessorFn: (row) => row.gender,
    },
    {
      id: "currentLevel",
      header: "CurrentLevel",
      accessorFn: (row) => row.currentLevel.split("_").join(" "),
      cell: (info) => info.getValue(),
      filterFn: fuzzyFilter,
    },
  ] satisfies ColumnDef<StudentResponseType>[];
};
