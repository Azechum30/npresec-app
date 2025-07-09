import { useHandleRoleDelete } from "@/app/(private)/admin/roles/hooks/use-handle-role-delete";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { RolesResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const useGetRolesColumns = () => {
  const { isPending, handleRoleDelete } = useHandleRoleDelete();
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
      accessorFn: (row) => row.name,
    },
    {
      header: "Permissions",
      cell: ({ row }) => {
        const permission_name = row.original.permissions.map(
          (perm) => perm?.name
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
          (perm) => perm?.description
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
          dialogId="updateRole"
          secondaryKey="id"
          row={row}
          onDelete={handleRoleDelete}
          isPending={isPending}
        />
      ),
    },
  ] satisfies ColumnDef<RolesResponseType>[];
};
