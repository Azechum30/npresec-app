import { Prisma } from "@/generated/prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";
import { ActionError, CUSTOM_ERRORS } from "./constants";

export const getErrorMessage = (error: unknown) => {
  const isProd = process.env.NODE_ENV === "production";
  const unKnownError = CUSTOM_ERRORS.UNKNOWN.message;

  if (error instanceof ActionError) {
    return error.message;
  }

  if (error instanceof z.ZodError) {
    return error.issues[0].message;
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return CUSTOM_ERRORS.UNIQUE_CONSTRAINTS.message;
      case "P2003":
        return CUSTOM_ERRORS.FOREIGN_KEY_VIOLATION.message;
      case "P2025":
        return CUSTOM_ERRORS.NOTFOUND.message;
      default:
        return unKnownError;
    }
  }

  if (isRedirectError(error)) {
    throw error;
  }
  if (error instanceof Error) {
    return isProd ? unKnownError : error.message;
  }

  return unKnownError;
};
