import { z } from "zod";

export function isZodFieldRequired(schema?: z.ZodTypeAny): boolean {
  if (!schema) return false;

  // Create a test value (undefined) and see if it fails
  const result = schema.safeParse(undefined);
  return !result.success;
}
