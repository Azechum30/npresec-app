/** biome-ignore-all assist/source/organizeImports:reason */
"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { AssessmentTimelineService } from "../service";

export const getAllAssessmentTimelines = async () =>
  nextSafeAction(
    async () => await new AssessmentTimelineService().listAssessmentTimelines(),
    { permission: "view:timelines" },
  );
