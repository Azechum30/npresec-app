/** biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { housesQueryOptions } from "../(admin)/admin/houses/queries";
import { roomsQueryOptions } from "../rooms/_actions/queries";
import {
  allocationsQueryOptions,
  studentsWithoutHouseAllocationsQueryOptions,
} from "./_actions/queries";
import { AllocationDialogsProvider } from "./_components/allocations-dialogs-provider";
import { RenderAllocationsTable } from "./_components/render-allocations-table";

export const metadata: Metadata = {
  title: "Manage House Allocations",
  description: "An intricate way to allocate and manage students assignments.",
  keywords: ["House Allocation", "Nakpanduri Presby SHTS", "Allocations"],
  creator: "NPRESEC",
  authors: [{ name: "IT Directorate" }],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};
export default function HouseAllocationsPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage House Allocations"
        showAddButton
        buttonText="Assign House"
        modalKey="create-allocation"
        permission="create:allocations"
      />

      <Suspense fallback={<FallbackComponent />}>
        <LoadStudentsHouseAllocationsData />
      </Suspense>

      <AllocationDialogsProvider />
    </>
  );
}

const LoadStudentsHouseAllocationsData = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    allocationsQueryOptions,
    studentsWithoutHouseAllocationsQueryOptions,
    housesQueryOptions,
    roomsQueryOptions(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderAllocationsTable />
    </HydrationBoundary>
  );
};
