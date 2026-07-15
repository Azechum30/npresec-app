/** biome-ignore-all assist/source/organizeImports: reason */
import { GenericActions } from "@/components/customComponents/GenericActions";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { ProgressBar } from "@/components/customComponents/progress-bar";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import type { client } from "@/lib/orpc";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteRoomMutationFn } from "../_actions/mutations";

export const useGetRoomsColumns = () => {
  const { mutateAsync, isPending } = useDeleteRoomMutationFn();
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
      header: "Code",
      accessorKey: "code",
    },
    {
      header: "House",
      accessorFn: (row) => row.house.name,
      cell: (info) => info.getValue(),
      filterFn: fuzzyFilter,
    },
    {
      header: "Capacity",
      accessorKey: "capacity",
    },
    {
      header: "Gender",
      accessorFn: (row) =>
        `${row.rmGender?.charAt(0).toUpperCase()}${row.rmGender?.slice(1).toLowerCase()}`,
    },
    {
      header: "Occupancy Rate",
      cell: ({ row }) => (
        <ProgressBar
          value={Math.floor(
            (row.original.students.length / row.original.capacity) * 100,
          )}
        />
      ),
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-room"
          isPending={isPending}
          onDelete={async (id) =>
            await Promise.try(async () => {
              await mutateAsync({ id });
            })
          }
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
    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<
    Awaited<ReturnType<typeof client.room.getRooms>>[number]
  >[];
};
