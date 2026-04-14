import { CloudinaryImageUploadSchema } from "@/utils/cloudinary-image-upload-schema";
import { EmailConfigSchema } from "@/utils/email-config";
import { z } from "zod";

const envSchema = z.object({
  ...EmailConfigSchema.shape,
  ...CloudinaryImageUploadSchema.shape,
  ARCJET_KEY: z.string().min(1),
  NEXT_PUBLIC_URL: z.url(),
  JWT_SECRET: z.string(),
  ADMIN_USER_EMAIL: z.email(),
  ADMIN_USER_PASSWORD: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  QSTASH_TOKEN: z.string().min(1),
  QSTASH_URL: z.url(),
  QSTASH_CURRENT_SIGNING_KEY: z.string().min(1),
  QSTASH_NEXT_SIGNING_KEY: z.string().min(1),
  DATABASE_URL: z.url(),
  PUSHER_SECRET: z.string(),
  PUSHER_APP_ID: z.string(),
  NEXT_PUBLIC_PUSHER_CLUSTER: z.string().max(2),
  NEXT_PUBLIC_PUSHER_APP_KEY: z.string(),
  UPSTASH_WORKFLOW_URL: z.url(),
  PAYSTACK_SECRET_KEY: z.string(),
  NEXT_PUBLIC_PAYSTACK_KEY: z.string(),
  PAYSTACK_INITIATE_TRANSACTION_URL: z.url(),
  PAYSTACK_VERIFY_TRANSACTION_URL: z.url(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.log(
    "❌ Invalid environment variables:",
    parsed.error.flatten().fieldErrors,
  );

  throw new Error("Invalid environment variables");
}

export const env = parsed.data;
