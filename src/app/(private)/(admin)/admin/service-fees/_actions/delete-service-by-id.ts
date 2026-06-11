"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import { updateTag } from "next/cache";
import "server-only";
import z from "zod";

export const deleteServiceById = async (
  id: string,
): Promise<{ error?: string; success?: boolean }> => {
  try {
    const { hasPermission } = await getUserPermissions("delete:services");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { error, success, data } = z.string().safeParse(id);

    if (!success) throw error;

    const deleted = await prisma.fee.delete({
      where: { id: data },
    });

    if (!deleted) throw new ActionError("Could not delete service");

    updateTag("services");

    return { success: true };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
