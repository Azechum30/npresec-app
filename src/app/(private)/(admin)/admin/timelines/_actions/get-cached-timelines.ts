import { prisma } from "@/lib/prisma";
import { AssessmentTimelinesSelect } from "@/lib/types";
import { cacheLife, cacheTag } from "next/cache";

export const getCachedTimelines = async () => {
  "use cache";
  cacheTag("assessment-timelines");
  cacheLife("max");

  return await prisma.assessmentTimeline.findMany({
    select: AssessmentTimelinesSelect,
  });
};
