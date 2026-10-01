/** biome-ignore-all assist/source/organizeImports:reason */
import { getQueryClient } from "@/components/providers/get-query-client";
import { keepPreviousData, queryOptions } from "@tanstack/react-query";
import { getQueryKey } from "../../staff/utils/get-query-key";
import { getAllAssessmentTimelines } from "./get-all-assessment-timelines";
import { getAssessmentTimelineById } from "./get-assesment-timeline-by-id";

export const timelinesQueryOptions = queryOptions({
  queryKey: getQueryKey().timeline.all,
  queryFn: getAllAssessmentTimelines,
  placeholderData: keepPreviousData,
});

export const getTimelimeQueryOptions = (timelineId: string) => {
  const queryClient = getQueryClient();

  return queryOptions({
    queryKey: getQueryKey(timelineId).timeline.single,
    queryFn: () => getAssessmentTimelineById(timelineId),
    initialData: () =>
      queryClient
        .getQueryData(timelinesQueryOptions.queryKey)
        ?.find((timeline) => timeline.id === timelineId),
    enabled: !!timelineId,
  });
};
