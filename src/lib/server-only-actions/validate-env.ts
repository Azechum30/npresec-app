import { CloudinaryImageUploadSchema } from "@/utils/cloudinary-image-upload-schema";
import { EmailConfigSchema } from "@/utils/email-config";
import { z } from "zod";

const envSchema = z.object({
  ...EmailConfigSchema.shape,
  ...CloudinaryImageUploadSchema.shape,
  NEXT_PUBLIC_URL: z.string().url(),
  JWT_SECRET: z.string(),
  ADMIN_USER_EMAIL: z.string().email(),
  ADMIN_USER_PASSWORD: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  REDIS_URL: z.string().url(),
  QSTASH_TOKEN: z.string().min(1),
  QSTASH_URL: z.string().url(),
  QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
  QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.log(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors
  );

  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
