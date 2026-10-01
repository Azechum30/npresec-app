/**biome-ignore-all assist/source/organizeImports:reason */
"use client";

import DataTable from "@/components/customComponents/data-table";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useDeleteAssessmentTimelinesMutationFn } from "../_actions/mutations";
import { timelinesQueryOptions } from "../_actions/queries";
import { useGetAssessmentTimelinesColumns } from "../_hooks/use-get-assessment-timelines-columns";

export const RenderAssessmentTimelinesTable = () => {
  const columns = useGetAssessmentTimelinesColumns();

  const { data } = useSuspenseQuery(timelinesQueryOptions);
  const { mutateAsync } = useDeleteAssessmentTimelinesMutationFn();

  const handleTimelinesDeletion = async (ids: string[]) => {
    await Promise.try(async () => {
      await mutateAsync(ids);
    });
  };

  return (
    <DataTable
      columns={columns}
      data={data ?? []}
      onDelete={async (rows) => {
        const ids = rows.map((row) => row.original.id);
        await handleTimelinesDeletion(ids);
      }}
    />
  );
};
