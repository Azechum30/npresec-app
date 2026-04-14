import { prisma } from "@/lib/prisma";
import { triggerServerNotification } from "@/lib/pusher";
import { env } from "@/lib/server-only-actions/validate-env";
import { BulkUploadPlacedStudententType } from "@/lib/validation";
import { getEmailBatchConfig } from "@/utils/email-batch-config";
import { toProperCase } from "@/utils/string-transformer";
import { serve } from "@upstash/workflow/dist/nextjs";
import { revalidateTag } from "next/cache";

const CourseMap: Record<string, string> = {
  "GEN. ARTS": "General Arts",
  "HOM. ECON.": "Home Economics",
  TECH: "Technical",
  AGRIC: "Agriculture",
  "VIS. ARTS": "Visual Arts",
};

export const { POST } = serve<{
  data: BulkUploadPlacedStudententType["data"];
  userId: string;
}>(
  async (context) => {
    const { data, userId } = context.requestPayload;
    const channelName = `userId-${userId}`;
    const config = getEmailBatchConfig();
    const transformedData = data.map((item) => ({
      ...item,
      enrollmentCode: item.enrollmentCode ?? null,
      programme: CourseMap[item.programme],
      lastName: toProperCase(item.lastName),
      otherNames: toProperCase(item.otherNames),
      jhsAttended: toProperCase(item.jhsAttended),
    }));
    const totalBatches = Math.ceil(transformedData.length / config.batchSize);

    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const start = batchIndex * config.batchSize;
      const chunk = transformedData.slice(start, start + config.batchSize);

      await context.run(`processing-batch-${batchIndex}`, async () => {
        await Promise.all(
          chunk.map(async (student) => {
            const existing = await prisma.admission.findUnique({
              where: { jhsIndexNumber: student.jhsIndexNumber },
            });

            if (existing) return;

            await prisma.$transaction(async (tx) => {
              const result = await tx.admission.create({
                data: student,
              });

              await tx.payment.create({
                data: {
                  admissionId: result.id,
                  amount: 51.0,
                  paymentStatus: "PENDING",
                  currency: "GHS",
                },
              });
            });
          }),
        );
      });
      await context.sleep(`sleep-${batchIndex}`, 5);
    }

    await context.run("final-cleanup-and-notification", async () => {
      revalidateTag("placement-list", "max");
      await triggerServerNotification(
        channelName,
        "placement-list-upload-success",
        {
          message: `Placement list uploaded successfully`,
          type: "success",
        },
      );
    });
  },
  {
    baseUrl: env.UPSTASH_WORKFLOW_URL,

    failureFunction: async ({ context }) => {
      const { userId } = context.requestPayload;

      const channelName = `userId-${userId}`;

      await triggerServerNotification(
        channelName,
        "placement-list-upload-failed",
        {
          message: "Placement list failed to upload",
          type: "error",
        },
      );
    },
  },
);
