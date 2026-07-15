/** biome-ignore-all assist/source/organizeImports: reason */
"use server";
import "server-only";

import { ActionError } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import { UserPermissionsFormSchema } from "@/lib/validation";

export const UpdateUserPermissions = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = UserPermissionsFormSchema.safeParse(values);

      if (!result.success) {
        throw new ActionError("Invalid data formatting submitted");
      }

      const { userId, roleId, permissions } = result.data;

      await prisma.$transaction(async (tsx) => {
        const userRolesCount = await tsx.userRole.count({
          where: { userId, roleId: { in: roleId } },
        });

        if (userRolesCount === 0) {
          throw new ActionError(
            "User does not have the specified roles assigned",
          );
        }

        if (userRolesCount > 2) {
          throw new ActionError(
            "User cannot update permissions for more than one role",
          );
        }

        await Promise.all(
          roleId.map((id) =>
            tsx.role.update({
              where: { id },
              data: {
                permissions: {
                  set: permissions.map((p) => ({ id: p })),
                },
              },
            }),
          ),
        );
      });

      await pusher.trigger(
        "cache-invalidation-settings",
        "user-role-permissions-updated",
        {
          triggeredBy: userId,
          roleId,
          permissions,
        },
      );

      return { success: true };
    },
    { permission: "edit:users" },
  );
