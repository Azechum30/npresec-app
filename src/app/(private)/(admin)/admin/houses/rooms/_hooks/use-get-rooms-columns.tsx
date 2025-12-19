import { client } from "@/lib/orpc";
import { ColumnDef } from "@tanstack/react-table";

export const useGetRoomsColumns = () => {
  return [
    {
      header: "RoomCode",
      accessorKey: "code",
    },
    {
      header: "House",
      accessorKey: "house.name",
      cell: ({ row }) => <span>{row.original.house.name}</span>,
    },
  ] satisfies ColumnDef<
    Awaited<ReturnType<typeof client.room.getRooms>>[number]
  >[];
};
