/** biome-ignore-all assist/source/organizeImports: reason */
import { ApproveOrDisapproveButton } from "@/components/customComponents/apporve-or-disapprove-button";
import { AvatarComponent } from "@/components/customComponents/avatar-component";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Badge } from "@/components/ui/badge";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import type { UserResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useDeleteUserMutationFn,
  useImpersonateUserMutationFn,
  useUnBanUserMutationFn,
} from "../_actions/mutations";

export const useGetUsersColumns = () => {
  const { mutateAsync, isPending } = useDeleteUserMutationFn();
  const { mutateAsync: unBanMutateAsync, isPending: isUnBanningPending } =
    useUnBanUserMutationFn();
  const {
    mutateAsync: impersonatetMutateAsync,
    isPending: isImpersonationPending,
  } = useImpersonateUserMutationFn();

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableHiding: false,
      enablePinning: false,
      enableColumnFilter: false,
      enableSorting: false,
      enableGrouping: false,
      enableResizing: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => (
        <AvatarComponent
          image={row.original.image ?? undefined}
          fallback={`${row.original.username[0]} ${row.original.username[1]}`}
        />
      ),
    },
    {
      header: "Email",
      accessorFn: (row) => row.email,
    },

    {
      header: "Role",
      cell: ({ row }) => {
        const roles = row.original.roles?.flatMap((rs) =>
          rs.role.name.split("_").join(" "),
        );

        return (
          <div className="line-clamp-2">
            {roles.map((role) => (
              <div key={role}>{role}</div>
            ))}
          </div>
        );
      },
    },

    {
      header: "Email Status",
      cell: ({ row }) => {
        return (
          <Badge
            variant={row.original.emailVerified ? "secondary" : "destructive"}>
            {row.original.emailVerified ? "Verified" : "Not Verified"}
          </Badge>
        );
      },
    },

    {
      header: "Approve",
      cell: ({ row }) => <ApproveOrDisapproveButton row={row} />,
    },
    {
      id: "status",
      header: "Status",
      accessorFn: (row) => (row.banned ? "Banned" : "Active"),
      cell: (info) => {
        const status = info.getValue();
        return status === "Banned" ? (
          <Badge variant="destructive">Banned</Badge>
        ) : (
          <Badge>Active</Badge>
        );
      },
      filterFn: fuzzyFilter,
    },

    {
      header: "Actions",
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <GenericActions
            secondaryKey="id"
            dialogId="update-user-role"
            row={row}
            onDelete={() => Promise.try(async () => await mutateAsync({ id }))}
            key={row.original.id}
            isPending={isPending}
            isUnbanningPending={isUnBanningPending}
            isImpersonationPending={isImpersonationPending}
            banModalKey="ban-user"
            unban={async () =>
              await Promise.try(async () => {
                await unBanMutateAsync(row.original.id);
              })
            }
            impersonate={async () =>
              await Promise.try(async () => {
                await impersonatetMutateAsync(row.original.id);
                window.location.reload();
              })
            }
          />
        );
      },
    },
  ] satisfies ColumnDef<UserResponseType>[];
};
