/** biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { staffQueryOptions } from "../staff/actions/queries";
import { HousesDialogProviders } from "./_components/houses-dialog-providers";
import { RenderHouseListTable } from "./_components/render-house-list-table";
import { housesQueryOptions } from "./queries";

export const metadata: Metadata = {
  title: "Manage Houses",
  description:
    "Discover a  way to create and manage students house affiliations. A simple way to track occupancy ratios and gain insight into students accommodation data in the school.",
  keywords: [
    "House Management",
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

export default async function HousesPage() {
  return (
    <div className="">
      <PageHeader
        pageTitle="Manage Houses"
        showAddButton
        buttonText="Add House"
        modalKey="create-house"
        permission="create:houses"
      />

      <Suspense fallback={<FallbackComponent />}>
        <LoadHousesData />
      </Suspense>

      <HousesDialogProviders />
    </div>
  );
}

const LoadHousesData = async () => {
  await connection();
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(housesQueryOptions),
    queryClient.ensureQueryData(staffQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderHouseListTable />
    </HydrationBoundary>
  );
};
