"use server";

import { ActionError } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import type { TimelineId } from "@/lib/types";
import { isArrayOfString } from "@/utils/is-array-of-strings";
import { AssessmentTimelineService } from "../service";

export const deleteTimelinesByIds = async (ids: string[]) =>
  nextSafeAction(
    async () => {
      if (!ids || ids.length === 0 || !isArrayOfString(ids))
        throw new ActionError("Invalid IDs");

      return await new AssessmentTimelineService().deleteAssessmentTimelines(
        ids as TimelineId[],
      );
    },
    { permission: "delete:timelines" },
  );
