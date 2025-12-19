import "dotenv/config";

import { Worker } from "bullmq";
import Redis from "ioredis";
import { env } from "@/lib/server-only-actions/validate-env";
import { uploadToCloudinary } from "@/utils/upload-to-cloudinary";
import { prisma } from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

const redis = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

type EntityType = "boardMember" | "user";
type SeriableType = {
  buffer: string;
  name: string;
  type: string;
};

export const updateEntityPicture = async (
  entityType: EntityType,
  entityId: string,
  pictureUrl: string
) => {
  if (entityType === "user") {
    await prisma.user.update({
      where: { id: entityId },
      data: { image: pictureUrl },
    });
    return { success: true };
  }
  // entityType === "boardMember"
  await prisma.boardMember.update({
    where: { id: entityId },
    data: { picture: pictureUrl },
  });
  return { success: true };
};

const worker = new Worker(
  "upload-image-to-cloudinary",
  async (job: {
    data: {
      file: SeriableType;
      entityId: string;
      entityType: EntityType;
      folder: string;
    };
  }) => {
    console.log("Job Received");
    const { file, entityId, entityType, folder } = job.data;

    const { secure_url, public_id } = await uploadToCloudinary(
      { ...file, name: file.name.replace(/\.[^/.]+$/, "") },
      folder
    );
    if (secure_url) {
      const updatedSecureUrl = cloudinary.url(public_id, {
        secure: true,
        transformation: [
          {
            width: 1200,
            crop: "limit",
            quality: "auto:best",
            fetch_format: "auto",
          },
        ],
      });

      await updateEntityPicture(entityType, entityId, updatedSecureUrl);
    }
  },
  { connection: redis }
);

worker.on("completed", (job) => console.log(`Job ${job.id} has completed!`));
worker.on("failed", (job, err) => {
  console.log(`Job ${job?.id} has failed with ${err.message}`);
});
worker.on("error", (err) => {
  console.error("Worker error:", err);
});
