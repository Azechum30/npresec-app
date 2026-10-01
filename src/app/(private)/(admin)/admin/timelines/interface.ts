import type { AssessmentTimelinesResponseType, TimelineId } from "@/lib/types";
import type {
  AssessmentTimeline,
  BulkAssessmentTimelinesType,
} from "@/lib/validation";

export interface IAssessmentTimeline {
  createTimeline: (
    data: AssessmentTimeline,
  ) => Promise<AssessmentTimelinesResponseType>;

  listAssessmentTimelines: () => Promise<AssessmentTimelinesResponseType[]>;
  getAssessmentTimeline: (
    timelineId: TimelineId,
  ) => Promise<AssessmentTimelinesResponseType>;

  updateAssessmentTimeline: (
    timelineId: TimelineId,
    data: AssessmentTimeline,
  ) => Promise<AssessmentTimelinesResponseType>;

  deleteAssessmentTimeline: (timelineId: TimelineId) => Promise<void>;
  deleteAssessmentTimelines: (
    timelineIds: TimelineId[],
  ) => Promise<{ count: number }>;

  bulkCreateAssessmentTimelines: (
    data: BulkAssessmentTimelinesType,
  ) => Promise<{ count: number }>;
}
