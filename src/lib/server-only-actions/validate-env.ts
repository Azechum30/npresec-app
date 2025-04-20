import { z } from "zod";
import { EmailConfigSchema } from "@/utils/email-config";

const envSchema = z.object({
  ...EmailConfigSchema.shape,
  NEXT_PUBLIC_URL: z.string().url(),
  JWT_SECRET: z.string(),
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
