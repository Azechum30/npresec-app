"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import "server-only";
import z from "zod";

export const deletePaymentsByIds = async (ids: string[]) => {
  try {
    const { hasPermission } = await getUserPermissions("delete:payments");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { error, success, data } = z.array(z.string()).safeParse(ids);

    if (!success) throw error;

    const deleted = await prisma.payment.updateMany({
      where: { id: { in: data } },
      data: { deletedAt: new Date() },
    });

    if (!deleted.count)
      throw new ActionError("Failed to delete given payments");

    updateTag("payments");

    return { success: true, count: deleted.count };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
