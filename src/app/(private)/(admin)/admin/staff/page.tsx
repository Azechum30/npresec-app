/** biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { classQueryOptions } from "../classes/actions/queries";
import { coursesQueryOptions } from "../courses/actions/queries";
import { departmentsQueryOptions } from "../departments/actions/queries";
import { staffQueryOptions } from "./actions/queries";
import CreateStaffDialog from "./components/CreateStaffDialog";
import EditStaffDialog from "./components/EditStaffDialog";
import RenderStaffData from "./components/Render-staff-data";
import StaffBulkUploadProvider from "./components/StaffBulkUploadProvider";
export const metadata: Metadata = {
  title: "Admin - Staff",
};

export default async function StaffPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(staffQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(coursesQueryOptions),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <h1 className="text-base font-semibold line-clamp-1">Manage Staff</h1>
        <OpenDialogs dialogKey="create-staff" title="Add Staff" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderStaffData />
      </Suspense>

      <StaffBulkUploadProvider />
      <EditStaffDialog />
      <CreateStaffDialog />
    </HydrationBoundary>
  );
}
