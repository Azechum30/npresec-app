import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
export const useFormValidityChecker = <T extends z.ZodTypeAny>(
  form: UseFormReturn<z.infer<T>>,
  schema: T
) => {
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkValidity = () => {
      const values = form.getValues();
      const result = schema.safeParse(values);
      setIsValid(result.success && form.formState.isDirty);
    };

    const subscription = form.watch(checkValidity);
    checkValidity();
    return () => subscription.unsubscribe();
  }, [form, schema]);

  return isValid;
};
