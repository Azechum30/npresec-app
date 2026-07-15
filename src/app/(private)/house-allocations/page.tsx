/** biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { studentsWithoutHouseAllocationsQueryOptions } from "./_actions/queries";

export default function HouseAllocationsPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Allocations"
        showAddButton
        buttonText="Add Allocation"
        modalKey="create-allocation"
        permission="create:houses"
      />

      <Suspense fallback={<FallbackComponent />}>
        <LoadStudentsHouseAllocationsData />
      </Suspense>
    </>
  );
}

const LoadStudentsHouseAllocationsData = async () => {
  const queryClient = getQueryClient();

  await Promise.all([studentsWithoutHouseAllocationsQueryOptions]);

  return <HydrationBoundary state={dehydrate(queryClient)}></HydrationBoundary>;
};
