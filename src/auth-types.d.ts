import "better-auth";

declare module "better-auth/types" {
  interface User {
    roles?: {
      id?: string;
      role?: {
        id?: string;
        name?: string;
        permissions?: {
          id: string;
          name: string;
        };
      };
    } | null;
  }

  interface Session {
    user: User;
  }
}

type UserRole = "admin" | "teaching_staff" | "student" | "parent" | "staff";

export const priorityRoles = [
  "admin",
  "teaching_staff",
  "student",
  "staff",
  "parent",
  "admin_staff",
  "support_staff",
];
