/**biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { ActionError } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { PermissionSchema } from "@/lib/validation";
import { z } from "zod";

const PermissionEditSchema = PermissionSchema.extend({ id: z.string() });

export const createPermissions = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = PermissionSchema.safeParse(values);
      if (!result.success) throw result.error;
      const { permissions } = result.data;
      const existingPermissions = await prisma.permission.findMany({
        where: {
          name: { in: permissions.map((perm) => perm.name) },
        },
      });

      if (existingPermissions.length > 0) {
        const permNames = existingPermissions.map((per) => per.name);

        throw new ActionError(
          `Permission(s) with name(s) ${permNames.join(",")} already exist`,
        );
      }

      const permissionsResult = await prisma.permission.createMany({
        data: permissions,
        skipDuplicates: true,
      });

      return { count: permissionsResult.count };
    },
    { permission: "create:permissions" },
  );

export const UpdatePermission = async (
  values: z.infer<typeof PermissionEditSchema>,
) =>
  nextSafeAction(
    async () => {
      const { error, success, data } = PermissionEditSchema.safeParse(values);

      if (!success) throw error;

      const { id, permissions } = data;

      await prisma.$transaction(async (tx) => {
        const existing = await tx.permission.findUnique({
          where: { id },
          select: { id: true },
        });

        if (!existing)
          throw new ActionError("No record matches the provided ID");

        return await tx.permission.update({
          where: { id },
          data: { ...permissions[0] },
        });
      });

      return { success: true };
    },
    { permission: "edit:permissions" },
  );

export const deletePermission = async (id: string) =>
  nextSafeAction(
    async () => {
      const { error, success, data: permissionId } = z.string().safeParse(id);

      if (!success) throw error;
      const permissionToDelete = await prisma.permission.findUnique({
        where: { id: permissionId },
        select: { id: true },
      });

      if (!permissionToDelete)
        throw new ActionError("No Permission with the supplied ID found!");

      await prisma.permission.delete({ where: { id: permissionToDelete.id } });
    },
    { permission: "delete:permissions" },
  );

export const bulkDeletePermissions = async (ids: string[]) =>
  nextSafeAction(
    async () => {
      const parsed = z.array(z.string().cuid()).safeParse(ids);

      if (!parsed.success) throw parsed.error;

      const permissionIds = parsed.data;

      const IDsMap = new Map(permissionIds.map((id) => [id, false]));

      const permissionsToDelete = await prisma.permission.findMany({
        where: { id: { in: permissionIds } },
        select: { id: true },
      });

      permissionsToDelete.forEach((record) => {
        if (IDsMap.has(record.id)) {
          IDsMap.set(record.id, true);
        }
      });

      const foundIds: string[] = [];
      const missingIds: string[] = [];

      for (const [id, exists] of IDsMap.entries()) {
        if (exists) {
          foundIds.push(id);
        } else {
          missingIds.push(id);
        }
      }

      if (!foundIds.length)
        throw new ActionError("No record matches the provided IDs");
      await prisma.permission.deleteMany({ where: { id: { in: foundIds } } });
      return { count: foundIds.length, missingIds };
    },
    { permission: "delete:permissions" },
  );
