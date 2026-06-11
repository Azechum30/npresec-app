"use server";
import { CURRENCY } from "@/generated/prisma/enums";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import z from "zod";

export const getServiceById = async (
  id: string,
): Promise<{
  error?: string;
  service?: {
    id: string;
    academicYear: string;
    name: string;
    price: string;
    currency: CURRENCY;
    count: number;
    capacity: number | null;
    status: string;
    deadline: Date;
  };
}> => {
  try {
    const { hasPermission } = await getUserPermissions("edit:services");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const { error, success, data } = z.string().safeParse(id);

    if (!success) throw error;

    const service = await prisma.fee.findUnique({
      where: { id: data },
      select: {
        id: true,
        academicYear: true,
        name: true,
        price: true,
        currency: true,
        count: true,
        capacity: true,
        status: true,
        deadline: true,
      },
    });

    if (!service)
      throw new ActionError(
        CUSTOM_ERRORS.NOTFOUND.message,
        CUSTOM_ERRORS.NOTFOUND.status,
        CUSTOM_ERRORS.NOTFOUND.code,
      );

    return { service: { ...service, price: String(service.price) } };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
