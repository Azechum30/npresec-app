/**biome-ignore-all assist/source/organizeImports: reason */
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import type { PermissionResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeletePermissionMutationFn } from "../actions/tanstack-mutation";

export const useGetPermissionsColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();
  const { isPending, mutateAsync } = useDeletePermissionMutationFn();
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
    {
      header: "Name",
      accessorFn: (row) => row.name.split(":").join(" "),
    },
    {
      header: "Description",
      accessorFn: (row) => row?.description,
    },
    {
      header: "CreatedAt",
      accessorFn: (row) => formatDate(row.createdAt),
    },
    {
      id: "Actions",
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-permission"
          onDelete={async (id) => {
            await Promise.try(async () => {
              await mutateAsync(id);
            });
          }}
          isPending={isPending}
        />
      ),
    },
  ] satisfies ColumnDef<PermissionResponseType>[];
};
