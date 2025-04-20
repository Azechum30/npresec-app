import { Prisma } from "@prisma/client";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { z } from "zod";

export const getErrorMessage = (error: unknown) => {
  const unKnownError = "Something went wrong. Please try again later";

  if (error instanceof z.ZodError) {
    const errors = error.issues.map((err) => err.message);
    return errors.join("\n");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return "A unique constraint was voilated! Please check your form inputs!";
      case "P2003":
        return "A foreign key constraint was voilated!";
      case "P2025":
        return "The requested resource was not found!";
      default:
        return "A database error occurred!";
    }
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return "Failed to connect to database. Please try again later!";
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return "An unexpected error occurred in the database engine. Please try again later.";
  }

  if (error instanceof Error && error.message.includes("ECONNREFUSED")) {
    return "Failed to connect to the database. Please check your network connection.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (isRedirectError(error)) {
    throw error;
  }

  console.error("Unhandled error:", error);

  return unKnownError;
};
