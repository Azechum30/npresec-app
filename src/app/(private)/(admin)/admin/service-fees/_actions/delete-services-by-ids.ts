"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import "server-only";
import z from "zod";

export const deleteServicesByIds = async (
  ids: string[],
): Promise<{ error?: string; success?: boolean; count?: number }> => {
  try {
    const { hasPermission } = await getUserPermissions("delete:services");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { error, success, data } = z.array(z.string()).safeParse(ids);

    if (!success) throw error;

    const deleteResponsePayload = await prisma.fee.deleteMany({
      where: { id: { in: data } },
    });

    if (!(deleteResponsePayload.count > 0)) {
      throw new ActionError("Could not delete the given records");
    }

    updateTag("services");

    return { success: true, count: deleteResponsePayload.count };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
