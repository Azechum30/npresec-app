import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";

export const useGetUserAccountColumns = () => {
  const { preferredDateFormat } = useUserPreferredDateFormat();
  return [
    {
      header: "Provider",
      accessorKey: "providerId",
    },
    {
      header: "CreatedAt",
      accessorFn: (row) => formatDate(row.createdAt, preferredDateFormat),
    },
    {
      header: "UpdatedAt",
      accessorFn: (row) => formatDate(row.updatedAt, preferredDateFormat),
    },
    {
      header: "Scope",
      cell: ({ row }) => {
        return (
          <span>
            {row.original.scopes.length ? row.original.scopes.join(",") : "N/A"}
          </span>
        );
      },
    },
  ] satisfies ColumnDef<
    Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number]
  >[];
};
