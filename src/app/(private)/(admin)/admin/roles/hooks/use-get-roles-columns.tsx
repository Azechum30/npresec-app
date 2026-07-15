/**biome-ignore-all assist/source/organizeImports: reason */
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import type { RolesResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteRoleMutationFn } from "../actions/tanstack-mutations";

export const useGetRolesColumns = () => {
  const { formatDate } = useUserPreferredDateFormat();
  const { mutateAsync, isPending } = useDeleteRoleMutationFn();

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },

    {
      header: "Role",
      accessorFn: (row) =>
        `${row.name.replaceAll(/[-_]/g, " ").charAt(0).toUpperCase()}${row.name.replaceAll(/[-_]/g, " ").slice(1).toLowerCase()}`,
    },
    {
      header: "CreatedAt",
      accessorFn: (row) => formatDate(row.createdAt),
    },
    {
      header: "Permissions",
      cell: ({ row }) => {
        const permission_name = row.original.permissions.map(
          (perm) => perm?.name,
        );
        return (
          <div className="line-clamp-2">
            {permission_name.map((name) => (
              <div key={name}>{name.split(":").join(" ")}</div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Description",
      cell: ({ row }) => {
        const permission_description = row.original.permissions.map(
          (perm) => perm?.description,
        );

        return (
          <div className="line-clamp-2">
            {permission_description.map((desc) => (
              <div key={desc}>{desc}</div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          dialogId="edit-role"
          secondaryKey="id"
          row={row}
          onDelete={async (id) => {
            await Promise.try(async () => {
              await mutateAsync(id);
            });
          }}
          isPending={isPending}
        />
      ),
    },
  ] satisfies ColumnDef<RolesResponseType>[];
};
