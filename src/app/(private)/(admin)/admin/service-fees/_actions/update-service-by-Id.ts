"use server";
import { Prisma } from "@/generated/prisma/client";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { FeeSchema, FeeType } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import "server-only";
import z from "zod";

const UpdateServiceSchema = FeeSchema.extend({
  id: z.string(),
  price: FeeSchema.shape.price
    .refine((val) => !isNaN(Number(val)), "Invalid number")
    .transform((val) => new Prisma.Decimal(val)),
});

export const updateServiceById = async (values: FeeType & { id: string }) => {
  try {
    const { hasPermission } = await getUserPermissions("edit:services");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { error, success, data } = UpdateServiceSchema.safeParse(values);

    if (!success) throw error;

    const { id, ...rest } = data;

    const updated = await prisma.fee.update({
      where: { id },
      data: {
        ...rest,
      },
    });

    if (!updated) throw new ActionError("Could not update service");

    updateTag("services");

    return { success: true };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
