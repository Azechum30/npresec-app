/** biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { coursesQueryOptions } from "../courses/actions/queries";
import { timelinesQueryOptions } from "./_actions/queries";
import { EditAssessmentTimelineModal } from "./_components/edit-assessment-timeline-modal";
import { RenderAssessmentTimelinesTable } from "./_components/render-assessment-timelines";
import { RenderBulkSetAssessmentTimelinesModal } from "./_components/render-bulk-set-assessment-timelines-modal";
import { RenderCreateAssessmentTimelineModal } from "./_components/render-create-assessment-timeline-form-modal";

export const metadata: Metadata = {
  title: "Timelines",
  description: "Schedule timelines for guard the entry of students scores",
  authors: [{ name: "NPRESEC" }],
  robots: {
    index: false,
    follow: false,
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

export default function AssessmentTimelinesPage() {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h4 className="text-xl font-bold bg-linear-to-r from-primary to-muted-foreground dark:to-accent bg-clip-text text-transparent line-clamp-1">
          Manage Score Timelines
        </h4>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <OpenDialogs
            dialogKey="create-assessment-timeline"
            title="Add Timeline"
            size="lg"
            permission="create:timelines"
          />
          <OpenDialogs
            dialogKey="bulk-set-assessment-timelines"
            title="Add Timelines"
            size="lg"
            variant="outline"
            permission="create:timelines"
          />
        </div>
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderAssessmentTimelinesDataTable />
      </Suspense>
    </div>
  );
}

const RenderAssessmentTimelinesDataTable = async () => {
  await connection();

  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.ensureQueryData(coursesQueryOptions),
    queryClient.ensureQueryData(timelinesQueryOptions),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderCreateAssessmentTimelineModal />
      <EditAssessmentTimelineModal />
      <RenderBulkSetAssessmentTimelinesModal />
      <RenderAssessmentTimelinesTable />
    </HydrationBoundary>
  );
};
