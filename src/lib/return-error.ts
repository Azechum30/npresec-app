import { getErrorMessage } from "./getErrorMessage";

export const returnError = (error: any) => {
  return process.env.NODE_ENV === "development"
    ? getErrorMessage(error)
    : "An unexpected error has occurred!";
};
