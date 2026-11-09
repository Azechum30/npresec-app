/**biome-ignore-all assist/source/organizeImports:reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";
import { RenderTemplatesTable } from "./_components/render-templates-table";
import { TemplateDialogs } from "./_components/template-dialogs";
import { templatesQueries } from "./queries";

export const metadata: Metadata = {
  title: "Manage Templates",
  description: "Manage all document templates in one place.",
  applicationName: "NPRESEC MIS",
  authors: [{ name: "NPRESEC MIS" }],
  robots: {
    follow: false,
    index: false,
    noarchive: true,
    nosnippet: true,
    googleBot: {
      follow: false,
      index: false,
      noarchive: true,
      nosnippet: true,
    },
  },
};

export default function TemplatesPage() {
  return (
    <>
      <PageHeader
        pageTitle="Manage Document Templates"
        showAddButton
        buttonText="Add Template"
        modalKey="create-a-document-template"
        permission="create:templates"
      />

      <Suspense fallback={<FallbackComponent />}>
        <TemplatesClient />
      </Suspense>

      <TemplateDialogs />
    </>
  );
}

const TemplatesClient = async () => {
  const queryClient = getQueryClient();
  await queryClient.ensureQueryData(templatesQueries);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderTemplatesTable />
    </HydrationBoundary>
  );
};
