"use server";

import { ActionError } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import type { TimelineId } from "@/lib/types";
import { AssessmentTimelineSchema } from "@/lib/validation";
import { AssessmentTimelineService } from "../service";

export const editAssessmentTimelineAction = async ({
  id,
  values,
}: {
  id: string;
  values: unknown;
}) =>
  nextSafeAction(
    async () => {
      const validParam = id && typeof id === "string";
      if (!validParam) throw new ActionError("Invalid Id provided");
      const parsedData = AssessmentTimelineSchema.safeParse(values);
      if (!parsedData.success) throw parsedData.error;

      return await new AssessmentTimelineService().updateAssessmentTimeline(
        id as TimelineId,
        parsedData.data,
      );
    },
    { permission: "edit:timelines" },
  );
