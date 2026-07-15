/** biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
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
    <>
      <PageHeader
        pageTitle="Manage Learning Areas"
        showAddButton
        buttonText="Add Department"
        modalKey="create-department"
        permission="create:departments"
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<FallbackComponent />}>
          <RenderDepartmentsDataTable />
        </Suspense>
      </HydrationBoundary>
      <DepartmentUploadProvider />
      <EditDepartment />
      <CreateDepartmentDialog />
    </>
  );
}
