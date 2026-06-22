/** biome-ignore-all assist/source/organizeImports: reason */

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { connection } from "next/server";
import { Suspense } from "react";
import { coursesQueryOptions } from "../courses/actions/queries";
import { getAllAssessmentTimelines } from "./_actions/get-all-assessment-timelines";
import { EditAssessmentTimelineModal } from "./_components/edit-assessment-timeline-modal";
import { RenderAssessmentTimelinesTable } from "./_components/render-assessment-timelines";
import { RenderBulkSetAssessmentTimelinesModal } from "./_components/render-bulk-set-assessment-timelines-modal";
import { RenderCreateAssessmentTimelineModal } from "./_components/render-create-assessment-timeline-form-modal";

export default async function AssessmentTimelinesPage() {
  const queryClient = getQueryClient();

  await queryClient.ensureQueryData(coursesQueryOptions);
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h4 className="text-base font-medium line-clamp-1">
          Assessment Timelines
        </h4>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <OpenDialogs
            dialogKey="create-assessment-timeline"
            title="Add Timeline"
            size="lg"
          />
          <OpenDialogs
            dialogKey="bulk-set-assessment-timelines"
            title="Add Timelines"
            size="lg"
            variant="outline"
          />
        </div>
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RenderCreateAssessmentTimelineModal />
          <EditAssessmentTimelineModal />
          <RenderBulkSetAssessmentTimelinesModal />
          <RenderAssessmentTimelinesDataTable />
        </HydrationBoundary>
      </Suspense>
    </div>
  );
}

const RenderAssessmentTimelinesDataTable = async () => {
  await connection();
  const { error, timelines } = await getAllAssessmentTimelines();

  return <RenderAssessmentTimelinesTable error={error} data={timelines} />;
};
