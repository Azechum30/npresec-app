/**biome-ignore-all assist/source/organizeImports: reason */
"use server";
import { ActionError } from "@/lib/constants";
import { nextSafeAction } from "@/lib/next-safe-action";
import { prisma } from "@/lib/prisma";
import { RoleSchema, UpdateRoleSchema } from "@/lib/validation";
import "server-only";
import { z } from "zod";

export const createRole = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = RoleSchema.safeParse(values);

      if (!result.success) throw result.error;
      const { name, permissions } = result.data;

      const role = await prisma.role.create({
        data: {
          name,
          permissions: {
            connect: permissions.map((permId) => ({ id: permId })),
          },
        },
      });

      return { role };
    },
    { permission: "create:roles" },
  );

export const updateRole = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = UpdateRoleSchema.safeParse(values);
      if (!result.success) throw result.error;
      const { id, data } = result.data;

      const existing = await prisma.role.findFirst({
        where: {
          id: { not: id },
          name: data.name,
        },
      });

      if (existing)
        throw new ActionError("a user role already exists with this name");

      const updatedRole = await prisma.role.update({
        where: { id },
        data: {
          ...data,
          permissions: {
            set: data.permissions.map((permId) => ({ id: permId })),
          },
        },
      });

      return { role: updatedRole };
    },
    { permission: "edit:roles" },
  );

export const deleteRole = async (value: string) =>
  nextSafeAction(
    async () => {
      const result = z.string().safeParse(value);
      if (!result.success) throw result.error;

      const existing = await prisma.role.findUnique({
        where: { id: result.data },
        select: { id: true },
      });

      if (existing === null)
        throw new ActionError("No record matched the provided Id");

      await prisma.role.delete({ where: { id: existing.id } });
    },
    { permission: "delete:roles" },
  );

export const bulkDeleteRoles = async (values: unknown) =>
  nextSafeAction(
    async () => {
      const result = z.array(z.string()).safeParse(values);

      if (!result.success) throw result.error;
      const ids = result.data;

      const transactResult = await prisma.$transaction(async (tx) => {
        const RoleIdSet = new Set(ids.map((id) => id));

        const existing = await tx.role.findMany({
          where: { id: { in: ids } },
          select: { id: true },
        });

        const filteredRoleIdsToDelete = existing
          .filter((role) => RoleIdSet.has(role.id))
          .map((role) => role.id);

        if (filteredRoleIdsToDelete.length === 0)
          throw new ActionError("No record match the provided Ids");
        const payload = await tx.role.deleteMany({
          where: { id: { in: filteredRoleIdsToDelete } },
        });

        return payload;
      });

      return { count: transactResult.count };
    },
    { permission: "delete:roles" },
  );
