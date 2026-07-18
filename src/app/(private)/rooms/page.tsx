/** biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { housesQueryOptions } from "../(admin)/admin/houses/queries";
import { roomsQueryOptions } from "./_actions/queries";
import { EditRoomModal } from "./_components/edit-room-modal";
import { RenderRoomDataTable } from "./_components/render-rooms-data-table";
import { RoomCreationModal } from "./_components/room-creation-modal";
export const metadata: Metadata = {
  title: "Manage Rooms",
  description:
    "Discover a  way to create and manage students room affiliations. A simple way to track occupancy ratios and gain insight into students accommodation data in the school.",
  keywords: [
    "Room Management",
    "Occupancy ratio",
    "Residency",
    "Nakpanduri Presby SHTS",
  ],
  creator: "NPRESEC",
  authors: [{ name: "IT Directorate" }],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function RoomsPage() {
  return (
    <div>
      <PageHeader
        pageTitle="Manage Rooms"
        showAddButton
        buttonText="Add Room"
        modalKey="create-room"
        permission="create:rooms"
      />
      <RoomCreationModal />
      <EditRoomModal />

      <Suspense fallback={<FallbackComponent />}>
        <RenderRooms />
      </Suspense>
    </div>
  );
}

const RenderRooms = async () => {
  await connection();
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.ensureQueryData(housesQueryOptions),
    queryClient.ensureQueryData(roomsQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderRoomDataTable />
    </HydrationBoundary>
  );
};
