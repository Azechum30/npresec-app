/** biome-ignore-all assist/source/organizeImports: reason */
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import type { auth } from "@/lib/auth";
import { formatDate } from "@/lib/format-date";
import type { ColumnDef } from "@tanstack/react-table";

export const useGetUserSessionsColumns = () => {
  const { preferredDateFormat } = useUserPreferredDateFormat();
  return [
    {
      header: "IP Address",
      accessorFn: (row) =>
        row?.ipAddress === "0000:0000:0000:0000:0000:0000:0000:0000"
          ? "Localhost"
          : row?.ipAddress === "127.0.0.1"
            ? "Localhost"
            : row?.ipAddress,
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
