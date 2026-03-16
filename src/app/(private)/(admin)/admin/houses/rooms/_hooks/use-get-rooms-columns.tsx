import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { client } from "@/lib/orpc";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { ColumnDef } from "@tanstack/react-table";
import { useTransition } from "react";
import { toast } from "sonner";

export const useGetRoomsColumns = () => {
  const [isDeleting, startTransition] = useTransition();
  const handleDeleteRooom = async (id: string) => {
    const safeClient = createSafeClient(client);

    startTransition(async () => {
      const { error } = await safeClient.room.deleteRoomById({ id });

      if (isDefinedError(error)) {
        toast.error(error.message || "Something went wrong!");
        return;
      } else if (error) {
        toast.error(error.message);
        return;
      } else {
        toast.success("room deleted successfully");
      }
    });
  };
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
      header: "RoomCode",
      accessorKey: "code",
    },
    {
      header: "House",
      accessorKey: "house.name",
      cell: ({ row }) => <span>{row.original.house.name}</span>,
    },
    {
      header: "BedCapacity",
      accessorKey: "capacity",
    },
    {
      header: "Gender",
      accessorKey: "rmGender",
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-room"
          isPending={isDeleting}
          onDelete={async (id) => await handleDeleteRooom(id)}
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
  ] satisfies ColumnDef<
    Awaited<ReturnType<typeof client.room.getRooms>>[number]
  >[];
};
