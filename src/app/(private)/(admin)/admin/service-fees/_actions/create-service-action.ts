"use server";
import { Prisma } from "@/generated/prisma/client";
import { STATUS } from "@/generated/prisma/enums";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { FeeSchema, FeeType } from "@/lib/validation";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import "server-only";

const FeeActionSchema = FeeSchema.extend({
  price: FeeSchema.shape.price
    .refine((val) => !isNaN(Number(val)), "Invalid number")
    .transform((val) => new Prisma.Decimal(val)),
});

export const createServiceAction = async (values: FeeType) => {
  try {
    const { hasPermission } = await getUserPermissions("create:services");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { error, success, data } = FeeActionSchema.safeParse(values);

    if (!success) throw error;

    const service = await prisma.fee.create({
      data: {
        ...data,
        status: data.status as STATUS,
      },
    });

    if (!service) throw new ActionError("Service could not not created");

    updateTag("services");

    return { success: true };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
