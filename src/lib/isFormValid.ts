// lib/form-utils.ts
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export function isFormValid<T extends z.ZodObject<any>>(
  form: UseFormReturn<z.infer<T>>,
  schema: T
): boolean {
  const values = form.getValues();
  const result = schema.safeParse(values);

  if (!result.success) return false;

  // Check all required fields are filled
  const requiredFields = Object.entries(schema.shape)
    .filter(
      ([_, fieldSchema]) =>
        !(fieldSchema as z.ZodTypeAny)._def.description?.includes(
          "isOptional:true"
        )
    )
    .map(([key]) => key);

  return requiredFields.every((field) => {
    const value = values[field];
    return value !== undefined && value !== null && value !== "";
  });
}
