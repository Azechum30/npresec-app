import { cache } from "react";
import { getAuthUser } from "./get-session";
import type { UserRole } from "./types";

export const hasRole = cache(async (role: UserRole): Promise<boolean> => {
  const user = await getAuthUser();

  if (!user) return false;

  return new Set(user.roles?.map((r) => r.role.name as UserRole)).has(role);
});
