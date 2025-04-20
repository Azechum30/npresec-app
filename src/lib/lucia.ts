import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia } from "lucia";
import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

interface DatabaseUserAttributes {
  id: string;
  email: string;
  username: string;
  picture?: string;
}
const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: "auth-session-token",
    expires: true,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (databaseUserAttributes) => {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      email: databaseUserAttributes.email,
      picture: databaseUserAttributes.picture,
    };
  },
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}
