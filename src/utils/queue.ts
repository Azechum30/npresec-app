import { env } from "@/lib/server-only-actions/validate-env";
import { Queue } from "bullmq";
import Redis from "ioredis";

const redis = new Redis(env.REDIS_URL);

export const queue = new Queue("upload-image-to-cloudinary", {
  connection: redis,
});
