/** biome-ignore-all assist/source/organizeImports: reason */
"use server";

import type { Prisma } from "@/generated/prisma/client";
import { nextSafeAction } from "@/lib/next-safe-action";
import {
  BulkClassesSchema,
  type BulkClassesType,
  BulkDeleteClassesSchema,
  type BulkDeleteClassesType,
  ClassesSchema,
  type ClassesType,
  UpdateClassSchema,
  type UpdateClassType,
} from "@/lib/validation";
import "server-only";
import { z } from "zod";
import { ClassesService } from "../service";

export const createClassAction = async (values: ClassesType) =>
  nextSafeAction(
    async () => {
      const result = ClassesSchema.safeParse(values);

      if (!result.success) throw result.error;
      return await new ClassesService().createClass(result.data);
    },
    { permission: "create:classes" },
  );

export const getClassesAction = async () =>
  nextSafeAction(async () => await new ClassesService().listClasses(), {
    permission: "view:classes",
  });

export const getClass = async (id: string) =>
  nextSafeAction(async () => await new ClassesService().getClass(id), {
    permission: "view:classes",
  });

export const updateClass = async (values: UpdateClassType) =>
  nextSafeAction(
    async () => {
      const result = UpdateClassSchema.safeParse(values);
      if (!result.success) throw result.error;
      const { id, ...rest } = result.data;

      return await new ClassesService().updateClass(id, rest);
    },
    { permission: "edit:classes" },
  );

export const deleteClass = async (id: string | Prisma.ClassWhereUniqueInput) =>
  nextSafeAction(
    async () => {
      const { error, success, data } = z
        .object({ id: z.cuid().min(1, "A class Id is required") })
        .safeParse(id);

      if (!success) throw error;
      return await new ClassesService().deleteClass(data.id);
    },
    { permission: "delete:classes" },
  );

export const bulkDeleteClasses = async (ids: BulkDeleteClassesType) =>
  nextSafeAction(
    async () => {
      const { error, success, data } = BulkDeleteClassesSchema.safeParse(ids);
      if (!success) throw error;
      return await new ClassesService().deleteClasses(data.ids);
    },
    { permission: "delete:classes" },
  );

export const updateClassEnrollment = async (
  classId: string,
  enrollmentCount: number,
) =>
  nextSafeAction(
    async () =>
      await new ClassesService().updateClassEnrollment(
        classId,
        enrollmentCount,
      ),
    { permission: "edit:classes" },
  );

export const bulkUploadClasses = async (values: BulkClassesType) =>
  nextSafeAction(
    async () => {
      const transformed = {
        data: values.data.map((item) => ({
          ...item,
          staff: item.staff?.toString().split(", "),
          departmentId: item.department,
          maxCapacity: Number(item.maxCapacity),
        })),
      };

      const { success, error, data } = BulkClassesSchema.safeParse(transformed);
      if (!success) throw error;
      return await new ClassesService().bulkCreateClasses(data);
    },
    { permission: "create:classes" },
  );
