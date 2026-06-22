/** biome-ignore-all assist/source/organizeImports:reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { departmentsQueryOptions } from "../departments/actions/queries";
import { staffQueryOptions } from "../staff/actions/queries";
import { classQueryOptions } from "./actions/queries";
import ClassesProvider from "./components/ClassesProvider";
import CreateClassDialog from "./components/CreateClassDialog";
import EditClassDialog from "./components/EditClassDialog";
import RenderClassesDataTable from "./components/RenderClassesDataTable";

export default async function ClassesPage() {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(staffQueryOptions),
  ]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-base font-semibold line-clamp-1">All Classes</h1>
        <OpenDialogs dialogKey="create-class" title="Add Class" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RenderClassesDataTable />
        </HydrationBoundary>
      </Suspense>

      <ClassesProvider />
      <EditClassDialog />
      <CreateClassDialog />
    </>
  );
}
