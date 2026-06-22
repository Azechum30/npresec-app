/** biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { staffQueryOptions } from "../staff/actions/queries";
import { departmentsQueryOptions } from "./actions/queries";
import CreateDepartmentDialog from "./components/create-department-dialog";
import DepartmentUploadProvider from "./components/DepartmentUploadProvider";
import EditDepartment from "./components/EditDepartment";
import RenderDepartmentsDataTable from "./components/render-departments-datateble";

export default async function DepartmentPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(staffQueryOptions),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col gap-y-2 sm:flex-row sm:justify-between sm:items-center sm:gap-y-0">
        <h1 className="font-semibold line-clamp-1">All Departments</h1>
        <OpenDialogs dialogKey="create-department" title="Add Department" />
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderDepartmentsDataTable />
      </Suspense>
      <DepartmentUploadProvider />
      <EditDepartment />
      <CreateDepartmentDialog />
    </HydrationBoundary>
  );
}
