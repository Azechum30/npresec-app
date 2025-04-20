import { PersonalInfoSchema } from "@/lib/validation";

type FormErrors = {
  [key: string]: string;
};
export const personalInfoAction = async (values: FormData) => {
  const validateData = PersonalInfoSchema.safeParse(values);

  let error: FormErrors = {};
  if (!validateData.success) {
    const errors = validateData.error.errors.reduce((acc, issue) => {
      acc[issue.path[0]] = issue.message;
      return acc;
    }, {} as Record<string, string>);

    error = errors;
  }

  return { error };
};
