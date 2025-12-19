"use client";

import DataTable from "@/components/customComponents/data-table";
import { client } from "@/lib/orpc";
import { Return } from "@prisma/client/runtime/client";
import { useGetRoomsColumns } from "../_hooks/use-get-rooms-columns";

type RenderRoomDataTableProps = {
  rooms: Awaited<ReturnType<typeof client.room.getRooms>>[number][];
};

export const RenderRoomDataTable = ({ rooms }: RenderRoomDataTableProps) => {
  const columns = useGetRoomsColumns();

  return (
    <>
      <DataTable data={rooms} columns={columns} />
    </>
  );
};
