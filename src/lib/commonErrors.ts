export const commonErrors = {
  FORBIDDEN: {
    message: "You do not have permission to perform this action",
    status: 403,
  },
  UNAUTHORIZED: {
    message: "You must be logged in to perform this action",
    status: 401,
  },
  NOT_FOUND: {
    message: "Resource not found",
    status: 404,
  },
  BAD_REQUEST: {
    message: "Invalid ID/data provided",
    status: 400,
  },
  UNIQUE_CONSTRAINT: {
    message: "Duplicate record violates unique constraint",
    status: 409,
  },
  FOREIGN_KEY_ERROR: {
    message: "Invalid reference to related entity",
    status: 400,
  },
};
