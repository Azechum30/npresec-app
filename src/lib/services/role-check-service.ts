import { authClient, type ExtendedSession } from "../auth-client";
import { getUserRole } from "../get-session";
import type { UserRole } from "../types";

export class RoleService {
  constructor(private roles: string[]) {}

  clientSideHasRole = async () => {
    const { data } = await authClient.getSession();
    if (!data?.user) return false;

    const user = data.user as ExtendedSession["user"];

    const userRoles = new Set(
      user.roles?.flatMap((role) => role.role?.name).filter(Boolean) ?? [],
    );

    return this.roles.some((role) => userRoles.has(role));
  };

  serverSideHasRole = async () => {
    const resolvedRoles = await getUserRole();
    if (!resolvedRoles) return false;

    const userRoles = new Set(resolvedRoles.map((role) => role));

    return this.roles.some((role) => userRoles.has(role as UserRole));
  };
}
