/**biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { permissionsQueryOptions } from "./actions/tanstack-queries";
import { PermissionsDialogsProvider } from "./components/permissions-dialogs-provider";
import { RenderPermissionsTable } from "./components/render-permissions-table";

export const metadata: Metadata = {
  title: "Manage Permissions",
  description: "A seamless way to create and manage user role permissions.",
  keywords: ["Permissions", "Nakpanduri Presby SHTS", "Role Permissions"],
  authors: [{ name: "IT Directorate" }],
  creator: "NPRESEC",
  robots: {
    index: false,
    follow: false,
    nosnippet: true,
    noarchive: true,
  },
};

export default function PermissionsPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Permissions"
        showAddButton
        buttonText="Add Permission"
        modalKey="create-permission"
        permission="create:permissions"
      />
      <Suspense fallback={<FallbackComponent />}>
        <RenderPermissionsDataTable />
      </Suspense>
      <PermissionsDialogsProvider />
    </>
  );
}

const RenderPermissionsDataTable = async () => {
  const queryClient = getQueryClient();

  await Promise.all([queryClient.ensureQueryData(permissionsQueryOptions)]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderPermissionsTable />
    </HydrationBoundary>
  );
};
