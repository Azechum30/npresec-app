import { z } from "zod";
export const EmailConfigSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_TEST_EMAIL: z.string().email(),
  RESEND_FROM_EMAIL: z.string().email(),
});
