/** biome-ignore-all assist/source/organizeImports: reason */
"use server";

import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import z from "zod";

export const approveOrDisapproveLogin = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = z
        .object({ userId: z.string(), emailVerified: z.boolean() })
        .safeParse(values);

      if (!result.success) throw result.error;
      const { userId, emailVerified } = result.data;

      await prisma.user.update({
        where: { id: userId },
        data: { emailVerified: !emailVerified },
      });
    },
    { permission: "create:users" },
  );
