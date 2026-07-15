/** biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { classQueryOptions } from "../classes/actions/queries";
import { coursesQueryOptions } from "../courses/actions/queries";
import { departmentsQueryOptions } from "../departments/actions/queries";
import { staffQueryOptions } from "./actions/queries";
import { StaffDialogsProvider } from "./components/dialog-providers";
import RenderStaffData from "./components/Render-staff-data";

export const metadata: Metadata = {
  title: "Manage Staff",
  description:
    "Manage the personal profiles of all staff of the school and assign roles and responsibilities to each staff in real-time.",
  keywords: ["Manage Staff", "Presbyterian SHTS", "North East SHS School"],
  creator: "NPRESEC",
  authors: [
    {
      name: "IT Directorate",
      url: "nakpanduripresec.org",
    },
  ],
  robots: {
    index: false,
    follow: false,
    nosnippet: true,
    noarchive: true,
  },
};

export default function StaffPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Staff"
        showAddButton
        buttonText="Add Staff"
        modalKey="create-staff"
        permission="create:staff"
      />

      <Suspense fallback={<FallbackComponent />}>
        <LoadStaffData />
      </Suspense>

      <StaffDialogsProvider />
    </>
  );
}

const LoadStaffData = async () => {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(staffQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(coursesQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderStaffData />
    </HydrationBoundary>
  );
};
