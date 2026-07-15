/** biome-ignore-all assist/source/organizeImports: reason */
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import type { client } from "@/lib/orpc";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteHouseMutationFn } from "../mutations";

export const useGetHouseColumns = () => {
  const { mutateAsync, isPending } = useDeleteHouseMutationFn();

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableSorting: false,
      enableHiding: false,
      enablePinning: false,
      enableResizing: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableMultiSort: false,
    },
    {
      header: "Name",
      accessorKey: "name",
    },
    {
      header: "Gender",
      accessorFn: (row) =>
        `${row.houseGender.charAt(0)}${row.houseGender.slice(1).toLowerCase()}`,
    },
    {
      header: "Residency",
      accessorFn: (row) =>
        `${row.residencyType.charAt(0)}${row.residencyType.slice(1).toLowerCase()}`,
    },
    {
      id: "maleRooms",
      header: "M-Rooms",
      accessorKey: "occupancy.maleOccupancy.roomCount",
    },
    {
      id: "femaleRooms",
      header: "F-Rooms",
      accessorKey: "occupancy.femaleOccupancy.roomCount",
    },
    {
      id: "houseMaster",
      header: "House Master",
      accessorFn: (row) =>
        row.houseMaster
          ? `${row.houseMaster.firstName} ${row.houseMaster.lastName}`
          : "Unassigned",
    },

    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          secondaryKey="id"
          dialogId="edit-house"
          onDelete={async () => {
            Promise.try(async () => await mutateAsync({ id: row.original.id }));
          }}
          row={row}
          isPending={isPending}
        />
      ),
    },
  ] satisfies ColumnDef<
    Awaited<ReturnType<typeof client.house.getHouses>>[number]
  >[];
};
