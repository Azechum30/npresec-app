import "better-auth";

declare module "better-auth/types" {
  interface User {
    role?: {
      id?: string;
      name?: string;
      permissions: {
        id: string;
        name: string;
      }[];
    } | null;
    permissions?: {
      id: string;
      name: string;
    }[];
  }

  interface Session {
    user: User;
  }
}

type UserRole = "admin" | "teaching_staff" | "student" | "parent" | "staff";
