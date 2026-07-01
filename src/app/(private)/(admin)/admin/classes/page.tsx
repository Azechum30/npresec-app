/** biome-ignore-all assist/source/organizeImports:reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { departmentsQueryOptions } from "../departments/actions/queries";
import { staffQueryOptions } from "../staff/actions/queries";
import { classQueryOptions } from "./actions/queries";
import { ClassesDialogsProvider } from "./components/classes-dialogs-provider";
import RenderClassesDataTable from "./components/RenderClassesDataTable";

export const metadata: Metadata = {
  title: "Manage Classes",
  description:
    "Get Access to all classes data. Create, delete, update and assign staff and students to each class in a secured and blazing fast manner.",
  keywords: [
    "Manage classes",
    "Nakpanduri Presby SHTS",
    "North East",
    "Ghana Education",
  ],
  creator: "NPRESEC",
  authors: [{ name: "IT Directorate", url: "https://nakpanduripresec.org" }],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function ClassesPage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base font-semibold line-clamp-1">Manage Classes</h1>
        <OpenDialogs dialogKey="create-class" title="Add Class" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <LoadClassesData />
      </Suspense>

      <ClassesDialogsProvider />
    </>
  );
}

const LoadClassesData = async () => {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(staffQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderClassesDataTable />
    </HydrationBoundary>
  );
};
