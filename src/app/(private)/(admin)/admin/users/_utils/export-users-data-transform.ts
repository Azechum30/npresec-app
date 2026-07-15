import type { UserResponseType } from "@/lib/types";
import type { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const exportUsersDataTransformer =
  (dateFormat: DateFormatType) => (user: UserResponseType) => ({
    Username: user.username,
    Email: user.email,
    Roles: user.roles?.flatMap((role) => role.role.name.includes("_"))
      ? user.roles.flatMap((role) => role.role.name.includes("_"))
        ? user.roles
            .flatMap((role) => role.role.name.split("_").join(" "))
            .join(", ")
        : user.roles.flatMap((role) => role.role.name).join(", ")
      : "N/A",
    "Email Verification Status": !!user.emailVerified,
    "Created Date": formatOrEmpty(user.createdAt, dateFormat),
  });
