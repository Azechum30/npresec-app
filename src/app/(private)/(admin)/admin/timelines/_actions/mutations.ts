/**biome-ignore-all assist/source/organizeImports:reason */

import type { MutationCacheType } from "@/components/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import { bulkAssessmentTimelinesAction } from "./bulk-create-assessment-timelines";
import { createAssessmentTimeline } from "./create-timeline-action";
import { deleteTimelinesByIds } from "./delete-timelimes-by-ids";
import { deleteTimelineById } from "./delete-timeline-by-id";
import { editAssessmentTimelineAction } from "./edit-assessment-timeline-action";
import { getTimelimeQueryOptions, timelinesQueryOptions } from "./queries";

export const useCreateAssessmentTimelineMutationFn = () =>
  useMutation({
    mutationFn: createAssessmentTimeline,
    meta: {
      invalidates: timelinesQueryOptions.queryKey,
      message: "timeline created",
    } satisfies MutationCacheType,
  });
export const useUpdateAssessmentTimelineMutationFn = (timelineId: string) =>
  useMutation({
    mutationFn: editAssessmentTimelineAction,
    meta: {
      invalidates: [
        timelinesQueryOptions.queryKey,
        getTimelimeQueryOptions(timelineId).queryKey,
      ],
      message: "timeline updated",
    } satisfies MutationCacheType,
  });

export const useDeleteAssessmentTimelineMutationFn = () =>
  useMutation({
    mutationFn: deleteTimelineById,
    meta: {
      invalidates: timelinesQueryOptions.queryKey,
      message: "timeline deleted",
    } satisfies MutationCacheType,
  });

export const useDeleteAssessmentTimelinesMutationFn = () =>
  useMutation({
    mutationFn: deleteTimelinesByIds,
    meta: {
      invalidates: timelinesQueryOptions.queryKey,
      message: "timeline(s) deleted",
    } satisfies MutationCacheType,
  });

export const useBulkCreateAssessmentTimelinesMutationFn = () =>
  useMutation({
    mutationFn: bulkAssessmentTimelinesAction,
    meta: {
      invalidates: timelinesQueryOptions.queryKey,
      message: "timeline(s) created",
    } satisfies MutationCacheType,
  });
