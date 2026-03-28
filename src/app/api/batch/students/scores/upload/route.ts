import { ASSESSMENT_WEIGHTS } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { BulkStudentsScoresUploadType } from "@/lib/types";
import { serve } from "@upstash/workflow/dist/nextjs";

export const { POST } = serve<BulkStudentsScoresUploadType>(async (context) => {
  const { data, userId, staffId } = context.requestPayload;
  const channelName = `userId-${userId}`;

  await context.run("create-students-scores", async () => {
    return await Promise.all(
      data.map(async (grade) => {
        const { classId, ...rest } = grade;
        return await prisma.grade.create({
          data: {
            ...rest,
            courseId: rest.courseId.id,
            studentId: rest.studentId.id,
            staffId,
            weight: ASSESSMENT_WEIGHTS[grade.assessmentType],
          },
        });
      }),
    );
  });

  await context.run("scores-creation-success", async () => {
    await triggerServerNotification(
      channelName,
      "students-grades-upload-success",
      {
        message: `${data.length} students grades uploaded`,
        type: "success",
      },
    );
  });
});
