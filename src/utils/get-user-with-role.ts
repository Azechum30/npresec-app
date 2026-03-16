import { getAuthUser } from "@/lib/get-session";

export const getUserWithRole = async (role: string) => {
  const user = await getAuthUser();

  if (!user) {
    return { user: null, hasRole: false };
  }

  const userRole = user.roles?.flatMap((r) => r.role.name) || [];

  const hasRole = userRole.includes(role);

  return { user, hasRole };
};
