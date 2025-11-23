import { getAuthUser } from "@/lib/getAuthUser";

export const getUserWithRole = async (role: string) => {
  const user = await getAuthUser();

  if (!user) {
    return { user: null, hasRole: false };
  }

  const userRole = user.role?.name || "";

  const hasRole = userRole === role;

  return { user, hasRole };
};
