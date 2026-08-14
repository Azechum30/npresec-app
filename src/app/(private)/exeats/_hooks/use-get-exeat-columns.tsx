/** biome-ignore-all assist/source/organizeImports: reason */
import { AvatarComponent } from "@/components/customComponents/avatar-component";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import { toProperCase } from "@/lib/to-proper-case";
import type { exeatServerResponseType } from "@/lib/validation";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteExeatRequestMutationFn } from "../_actions/mutations";

export const useGetExeatColumns = () => {
  const { isPending, mutateAsync } = useDeleteExeatRequestMutationFn();
  const { onOpen } = useGenericDialog();
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections table={table} isHeader />,
      cell: ({ row }) => <RowSelections row={row} isHeader={false} />,
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
      header: "Avatar",
      cell: ({ row }) => (
        <AvatarComponent
          image={row.original.student.user?.image as string}
          fallback={`${row.original.student.lastName} ${row.original.student.firstName}`}
        />
      ),
    },
    {
      header: "Student Name",
      accessorFn: (row) =>
        `${row.student.lastName} ${row.student.firstName} ${row.student.middleName ?? ""}`,
      cell: (info) => info.getValue(),
      filterFn: fuzzyFilter,
    },
    {
      header: "Exeat Number",
      accessorKey: "exeatNumber",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="p-0 hover:cursor-pointer hover:underline"
          onClick={() => onOpen("view-exeat-details", row.original.id)}>
          {row.original.exeatNumber}
        </Button>
      ),
      filterFn: fuzzyFilter,
    },
    {
      header: "Destination",
      accessorFn: (row) => row.destination,
    },
    {
      header: "Type",
      accessorFn: (row) => toProperCase(row.type),
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "PENDING"
              ? "secondary"
              : row.original.status === "APPROVED"
                ? "outline"
                : row.original.status === "ACTIVE"
                  ? "default"
                  : row.original.status === "OVERDUE"
                    ? "destructive"
                    : row.original.status === "RETURNED"
                      ? "ghost"
                      : "link"
          }>
          {toProperCase(row.original.status)}
        </Badge>
      ),
      filterFn: fuzzyFilter,
    },
    {
      header: "Depature Date",
      accessorFn: (row) =>
        (row.departureDate as Date).toISOString().split("T")[0],
    },
    {
      header: "Return Date",
      accessorFn: (row) =>
        (row.expectedReturnDate as Date).toISOString().split("T")[0],
    },

    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-exeat"
          onDelete={async (id) => {
            await Promise.try(async () => await mutateAsync(id));
          }}
          isPending={isPending}
        />
      ),
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<exeatServerResponseType>[];
};
