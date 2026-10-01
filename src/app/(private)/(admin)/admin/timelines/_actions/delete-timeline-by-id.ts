/** biome-ignore-all assist/source/organizeImports:reason */
"use server";

import { ActionError } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import type { TimelineId } from "@/lib/types";
import { AssessmentTimelineService } from "../service";

export const deleteTimelineById = async (id: string) =>
  nextSafeAction(
    async () => {
      if (!id || typeof id !== "string")
        throw new ActionError("Invalid ID provided");
      return await new AssessmentTimelineService().deleteAssessmentTimeline(
        id as TimelineId,
      );
    },
    { permission: "delete:timelines" },
  );
