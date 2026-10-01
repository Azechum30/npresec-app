"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { BulkAssessmentTimelinesSchema } from "@/lib/validation";
import { AssessmentTimelineService } from "../service";

export const bulkAssessmentTimelinesAction = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const parsedData = BulkAssessmentTimelinesSchema.safeParse(values);
      if (!parsedData.success) throw parsedData.error;

      return await new AssessmentTimelineService().bulkCreateAssessmentTimelines(
        parsedData.data,
      );
    },
    { permission: "create:timelines" },
  );
