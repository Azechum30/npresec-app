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
