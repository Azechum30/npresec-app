"use client";

import DataTable from "@/components/customComponents/data-table";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import { client } from "@/lib/orpc";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { useMemo, useTransition } from "react";
import { toast } from "sonner";
import { useGetRoomsColumns } from "../_hooks/use-get-rooms-columns";
import { createRoomsDataTransformer } from "../_utils/rooms-transformer";

type RenderRoomDataTableProps = {
  rooms: Awaited<ReturnType<typeof client.room.getRooms>>[number][];
};

export const RenderRoomDataTable = ({ rooms }: RenderRoomDataTableProps) => {
  const columns = useGetRoomsColumns();
  const { preferredDateFormat } = useUserPreferredDateFormat();
  const roomsTransformer = useMemo(
    () => createRoomsDataTransformer(preferredDateFormat),
    [preferredDateFormat]
  );

  const [isPending, startTransition] = useTransition();

  const handleRoomsDeleteByIds = async (ids: string[]) => {
    const safeClient = createSafeClient(client);

    startTransition(async () => {
      const { error, data } = await safeClient.room.deleteRoomsByIds({ ids });
      if (isDefinedError(error)) {
        toast.error(error.message || "Something went wrong!");
        return;
      } else if (error) {
        toast.error(error.message || "Something went wrong!");
        return;
      } else if (data) {
        toast.success(`${data.count} room(s) deleted successfully`);
      }
    });
  };

  return (
    <>
      <DataTable
        filename="rooms-list"
        transformer={roomsTransformer}
        data={rooms}
        columns={columns}
        onDelete={async (rows) => {
          const rowIds = rows.map((row) => row.original.id);
          await handleRoomsDeleteByIds(rowIds);
        }}
      />
    </>
  );
};
