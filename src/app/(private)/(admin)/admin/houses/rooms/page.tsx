import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { RoomCreationModal } from "./_components/room-creation-modal";
import { RenderRoomDataTable } from "./_components/render-rooms-data-table";
import { createSafeClient, isDefinedError } from "@orpc/client";
import { client } from "@/lib/orpc";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{
  [key: string]: string | undefined;
}>;

export default function RoomsPage(props: { searchParams: SearchParams }) {
  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-0">
        <h1 className="font-semibold text-base line-clamp-1">All Rooms</h1>
        <div>
          <OpenDialogs dialogKey="create-room" />
        </div>
      </div>
      <RoomCreationModal />

      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            cellWidths={[
              "10rem",
              "10rem",
              "10rem",
              "6rem",
              "10rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          />
        }
      >
        <RenderRooms searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

const RenderRooms = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const querySearch = await searchParams;
  const houseId = querySearch?.houseId;

  const safeClient = createSafeClient(client);

  const { error, data } = await safeClient.room.getRooms({
    houseId,
  });

  if (isDefinedError(error)) {
    return <ErrorComponent error={error.message} />;
  } else if (error) {
    return <ErrorComponent error={error.message} />;
  }

  if (!data) {
    return <ErrorComponent error="No data received" />;
  }

  return <RenderRoomDataTable rooms={data} />;
};
