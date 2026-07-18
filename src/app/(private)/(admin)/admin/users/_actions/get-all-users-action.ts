/** biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { ActionError } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { UserSelect } from "@/lib/types";

export const getAllUsersAction = async () =>
  nextSafeAction(
    async () => {
      const users = await prisma.user.findMany({
        select: UserSelect,
        orderBy: [{ createdAt: "desc" }],
      });

      return { users: users };
    },
    { permission: "view:users" },
  );

export const getUserById = async (id: string) =>
  nextSafeAction(
    async () => {
      const user = await prisma.user.findUnique({
        where: { id },
        select: UserSelect,
      });

      if (!user) throw new ActionError("user not found");

      return user;
    },
    { permission: "view:users" },
  );
