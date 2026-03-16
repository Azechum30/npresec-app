import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { auth } from "@/lib/auth";
import { formatDate } from "@/lib/format-date";
import { ColumnDef } from "@tanstack/react-table";

export const useGetUserSessionsColumns = () => {
  const { preferredDateFormat } = useUserPreferredDateFormat();
  return [
    {
      header: "IP Address",
      accessorKey: "ipAddress",
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
      header: "ExpiresAt",
      accessorFn: (row) => formatDate(row.expiresAt, preferredDateFormat),
    },
  ] satisfies ColumnDef<
    Awaited<ReturnType<typeof auth.api.listSessions>>[number]
  >[];
};
