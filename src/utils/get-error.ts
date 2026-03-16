import { getErrorMessage } from "@/lib/getErrorMessage";

export const getError = (error: any) => {
  return process.env.NODE_ENV === "development"
    ? getErrorMessage(error)
    : "Something went wrong!";
};
