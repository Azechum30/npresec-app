/** biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { connection } from "next/server";
import { Suspense } from "react";
import {
  studentsExeatsRequestQueryOptions,
  studentsToAssignExeatQueryOptions,
} from "./_actions/queries";
import { ExeatDialogsProvider } from "./_components/exeat-dialogs-provider";
import { RenderStudentExeatsTable } from "./_components/render-student-exeats-table";

export default function ExeatsPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Exeats"
        permission="create:exeats"
        buttonText="Request Exeat"
        modalKey="request-exeat"
        showAddButton
      />
      <Suspense fallback={<FallbackComponent />}>
        <RenderExeatsDataTable />
      </Suspense>

      <ExeatDialogsProvider />
    </>
  );
}

const RenderExeatsDataTable = async () => {
  await connection();
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(studentsToAssignExeatQueryOptions),
    queryClient.ensureQueryData(studentsExeatsRequestQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderStudentExeatsTable />
    </HydrationBoundary>
  );
};
