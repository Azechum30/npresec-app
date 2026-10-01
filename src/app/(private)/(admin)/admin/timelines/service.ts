/** biome-ignore-all assist/source/organizeImports:reason */

import type { Prisma } from "@/generated/prisma/client";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import {
  type AssessmentTimelinesResponseType,
  AssessmentTimelinesSelect,
  type TimelineId,
} from "@/lib/types";
import type {
  AssessmentTimeline,
  BulkAssessmentTimelinesType,
} from "@/lib/validation";
import type { IAssessmentTimeline } from "./interface";

export class AssessmentTimelineService implements IAssessmentTimeline {
  private async getTimeline(
    timelineId?: TimelineId,
    data?: Partial<AssessmentTimeline>,
  ): Promise<AssessmentTimelinesResponseType | null> {
    const whereClause: Prisma.AssessmentTimelineWhereInput = {};

    if (timelineId && !data) {
      whereClause.id = timelineId;
    }

    if (data) {
      const { courseId, semester, assessmentType, startDate, endDate } = data;

      whereClause.courseId = courseId;
      whereClause.semester = semester;
      whereClause.assessmentType = assessmentType;

      if (startDate && endDate) {
        whereClause.AND = [
          { startDate: { lte: endDate } },
          { endDate: { gte: startDate } },
        ];
      }

      if (timelineId) {
        whereClause.NOT = { id: timelineId };
      }
    }

    const timeline = await prisma.assessmentTimeline.findFirst({
      where: whereClause,
      select: AssessmentTimelinesSelect,
    });

    return timeline;
  }

  async createTimeline(data: AssessmentTimeline) {
    const timeline = await this.getTimeline(undefined, data);

    if (timeline)
      throw new ActionError(
        "A timeline with overlapping dates already exists for this course.",
      );
    return await prisma.assessmentTimeline.create({
      data,
      select: AssessmentTimelinesSelect,
    });
  }

  async listAssessmentTimelines() {
    return prisma.assessmentTimeline.findMany({
      select: AssessmentTimelinesSelect,
    });
  }

  async getAssessmentTimeline(timelineId: string) {
    const timeline = await this.getTimeline(timelineId as TimelineId);
    if (!timeline) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);
    return timeline;
  }

  async updateAssessmentTimeline(
    timelineId: TimelineId,
    data: AssessmentTimeline,
  ) {
    const timeline = await this.getTimeline(timelineId, data);

    if (timeline)
      throw new ActionError(
        "These edits cause a timeline collision with another existing record.",
      );

    return await prisma.assessmentTimeline.update({
      where: { id: timelineId },
      data,
      select: AssessmentTimelinesSelect,
    });
  }

  async deleteAssessmentTimeline(timelineId: TimelineId) {
    const timeline = await this.getTimeline(timelineId);
    if (!timeline) throw new ActionError(CUSTOM_ERRORS.NOTFOUND.message);

    await prisma.assessmentTimeline.delete({
      where: { id: timeline.id },
    });
  }

  async deleteAssessmentTimelines(timelineIds: TimelineId[]) {
    return await prisma.assessmentTimeline.deleteMany({
      where: { id: { in: timelineIds } },
    });
  }

  async bulkCreateAssessmentTimelines(data: BulkAssessmentTimelinesType) {
    const transformedData = data.courseIds.map((courseId) => ({
      courseId,
      startDate: data.startDate,
      endDate: data.endDate,
      assessmentType: data.assessmentType,
      semester: data.semester,
      academicYear: data.academicYear,
    }));

    const filterResults = await Promise.all(
      transformedData.map(async (item) => {
        const result = await this.getTimeline(undefined, item);
        return result === null;
      }),
    );
    const filteredData = transformedData.filter(
      (_, index) => filterResults[index],
    );

    return await prisma.assessmentTimeline.createMany({
      data: filteredData,
    });
  }
}
