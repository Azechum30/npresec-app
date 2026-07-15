/**biome-ignore-all assist/source/organizeImports: reason */
import { RenderRolesDataTable } from "@/app/(private)/(admin)/admin/roles/components/RenderRolesDataTable";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { permissionsQueryOptions } from "../permissions/actions/tanstack-queries";
import { rolesQueryOptions } from "./actions/tanstack-queries";
import { RolesDialogsProvider } from "./components/roles-dialogs-Providers";

export default function RolesPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Roles"
        showAddButton
        buttonText="Add Role"
        modalKey="create-role"
        permission="create:roles"
      />

      <Suspense fallback={<FallbackComponent />}>
        <RenderRolesTables />
      </Suspense>

      <RolesDialogsProvider />
    </>
  );
}

const RenderRolesTables = async () => {
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.ensureQueryData(rolesQueryOptions),
    queryClient.ensureQueryData(permissionsQueryOptions),
  ]);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderRolesDataTable />
    </HydrationBoundary>
  );
};
