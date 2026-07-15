import type { PermissionResponseType } from "@/lib/types";
import type { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const permissionsTransformer =
  (dateFormat: DateFormatType) => (permission: PermissionResponseType) => ({
    "Permission Name": permission.name
      .replace(/[:]/g, " ")
      .split(" ")
      .map(
        (word) =>
          `${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`,
      )
      .join(" "),
    Description: permission.description,
    "Created Date": formatOrEmpty(permission.createdAt, dateFormat),
  });
