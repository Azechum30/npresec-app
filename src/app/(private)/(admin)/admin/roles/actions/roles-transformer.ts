import type { RolesResponseType } from "@/lib/types";
import type { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const rolesTransformer =
  (format: DateFormatType) => (role: RolesResponseType) => ({
    "Role Name": `${role.name.replaceAll(/[-_]/g, " ").charAt(0).toUpperCase()}${role.name.replaceAll(/[-_]/g, " ").slice(1).toLowerCase()}`,
    "Created Date": formatOrEmpty(role.createdAt, format),
    Permissions: role.permissions
      .map((role) => role.name.replace(/[:]/g, " "))
      .join(", "),
  });
