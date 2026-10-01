"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { AssessmentTimelineService } from "../service";

export const getAssessmentTimelineById = async (id: string) =>
  nextSafeAction(
    async () => {
      return await new AssessmentTimelineService().getAssessmentTimeline(id);
    },
    { permission: "view:timelines" },
  );
