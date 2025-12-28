import { checkAuthAction } from "@/app/actions/auth-actions";

export const getUserWithRole = async (role: string) => {
  const { user } = await checkAuthAction();

  if (!user) {
    return { user: null, hasRole: false };
  }

  const userRole = user.role?.name || "";

  const hasRole = userRole === role;

  return { user, hasRole };
};
