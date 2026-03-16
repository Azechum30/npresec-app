import { UserResponseType } from "@/lib/types";
import { DateFormatType } from "@/lib/validation";
import { formatOrEmpty } from "@/utils/format-or-empty";

export const exportUsersDataTransformer =
  (dateFormat: DateFormatType) => (user: UserResponseType) => ({
    Username: user.username,
    Email: user.email,
    Role: user.roles?.flatMap((role) => role.role.name.includes("_"))
      ? user.roles.flatMap((role) => role.role.name.includes("_"))
        ? user.roles
            .flatMap((role) => role.role.name.split("_").join(" "))
            .join(", ")
        : user.roles.flatMap((role) => role.role.name).join(", ")
      : "N/A",
    EmailVerified: user.emailVerified ? true : false,
    CreatedAt: formatOrEmpty(user.createdAt, dateFormat),
  });
