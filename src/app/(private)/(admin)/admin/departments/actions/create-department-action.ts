/** biome-ignore-all assist/source/organizeImports: reason */

"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { DepartmentSelect } from "@/lib/types";
import { DepartmentSchema, type DepartmentType } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import z from "zod";

export const createDepartment = async (values: DepartmentType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:departments");

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const { data, success, error } = DepartmentSchema.safeParse(values);

    if (!success) throw error;
    const existingRecord = await prisma.department.findFirst({
      where: {
        OR: [{ code: data.code }, { name: data.name }, { headId: data.headId }],
      },
    });

    if (existingRecord) {
      if (existingRecord.code === data.code) {
        throw new ActionError("department code is already taken");
      } else if (existingRecord.name === data.name) {
        throw new ActionError("department name is already taken");
      } else if (existingRecord.headId === data.headId) {
        throw new ActionError("The selected staff is already engaged");
      }
    }

    const department = await prisma.department.create({
      data: data,
      select: DepartmentSelect,
    });

    return { department };
  } catch (error) {
    console.error("An error occurred", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};

export const updateDepartmentAction = async (
  values: DepartmentType & { id: string },
) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:departments");

    if (!hasPermission)
      throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);

    const { data, success, error } = DepartmentSchema.extend({
      id: z.string(),
    }).safeParse(values);

    if (!success) throw error;

    const { id, ...rest } = data;

    const duplicate = await prisma.department.findFirst({
      where: {
        AND: [
          {
            OR: [
              { code: rest.code },
              { name: rest.name },
              { headId: rest.headId },
            ],
          },
          { id: { not: id } },
        ],
      },
    });

    if (duplicate) {
      if (duplicate.code === rest.code) {
        throw new ActionError("A department already exists with is this code");
      } else if (duplicate.name === rest.code) {
        throw new ActionError("A department already exists with this name");
      } else if (duplicate.headId === rest.headId) {
        throw new ActionError(
          "The selected staff is already assigned as a departmental head",
        );
      } else {
        throw new ActionError("A duplicate record found");
      }
    }

    const response = await prisma.department.update({
      where: { id },
      data: { ...rest },
      select: DepartmentSelect,
    });

    if (!response) throw new ActionError("Failed to update department");

    return response;
  } catch (error) {
    console.error("An error occurred", error);
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};
