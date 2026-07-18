/** biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { permissionsQueryOptions } from "../permissions/actions/tanstack-queries";
import { rolesQueryOptions } from "../roles/actions/tanstack-queries";
import { usersQueryOptions } from "./_actions/queries";
import { RenderUsersTable } from "./_components/render-users-table";
import { UsersDialogsProviders } from "./_components/users-dialogs-providers";

export const metadata: Metadata = {
  title: "Manage Users",
  description:
    "Manage all users on the school management information system in a seamless manner.",
  keywords: ["Users", "Nakpanduri Presby SHTS"],
  creator: "NPRESEC",
  authors: [{ name: "IT Directorate" }],
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function UsersPage() {
  return (
    <div>
      <PageHeader
        pageTitle="Manage Users"
        showAddButton
        buttonText="Add User"
        modalKey="create-auth-user"
        permission="create:users"
      />
      <Suspense fallback={<FallbackComponent />}>
        <RenderUserTable />
      </Suspense>

      <UsersDialogsProviders />
    </div>
  );
}

const RenderUserTable = async () => {
  await connection();
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.ensureQueryData(usersQueryOptions),
    queryClient.ensureQueryData(permissionsQueryOptions),
    queryClient.ensureQueryData(rolesQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderUsersTable />
    </HydrationBoundary>
  );
};
