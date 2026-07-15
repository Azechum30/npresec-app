import type { ExtendedSession } from "./auth-client";

export const userHasRole = (user: ExtendedSession["user"]) => {
  return new Set(user.roles?.map((r) => r.role?.name ?? "").filter(Boolean));
};
