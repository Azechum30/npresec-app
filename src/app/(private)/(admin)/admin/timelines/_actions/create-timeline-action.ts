/** biome-ignore-all assist/source/organizeImports:reason */
"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { AssessmentTimelineSchema } from "@/lib/validation";
import { AssessmentTimelineService } from "../service";
export const createAssessmentTimeline = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const validData = AssessmentTimelineSchema.safeParse(values);
      if (!validData.success) throw validData.error;

      return await new AssessmentTimelineService().createTimeline(
        validData.data,
      );
    },
    { permission: "create:timelines" },
  );
