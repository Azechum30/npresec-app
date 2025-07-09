import { PermissionResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const useGetPermissionsColumns = () => {
  return [
    {
      header: "Permision Name",
      accessorFn: (row) => row.name.split(":").join(" "),
    },
    {
      header: "Description",
      accessorFn: (row) => row?.description,
    },
  ] satisfies ColumnDef<PermissionResponseType>[];
};
