/** biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { UpdateUserRoleSchema } from "@/lib/validation";
import "server-only";

export const updateUserRole = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const { error, success, data } = UpdateUserRoleSchema.safeParse(values);

      if (!success) throw error;

      const { userId, roleId, roleType } = data;

      if (Array.isArray(roleId) && roleType === "Organizational") {
        await prisma.$transaction(async (tsx) => {
          await tsx.userRole.deleteMany({
            where: { userId },
          });

          return await prisma.user.update({
            where: { id: userId },
            data: {
              roles: {
                create: roleId.map((id) => ({ roleId: id })),
              },
            },
          });
        });
      } else {
        await prisma.user.update({
          where: { id: userId },
          data: { role: roleId as string },
        });
      }

      await pusher.trigger(
        "cache-invalidation-settings",
        "user-role-updated",
        {},
      );
      return { success: true };
    },
    { permission: "edit:users" },
  );
