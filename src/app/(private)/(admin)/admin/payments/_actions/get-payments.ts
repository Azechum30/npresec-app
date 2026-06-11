"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import { getCachedPayments } from "../_utils/get-cached-payments";

export const getPayments = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:payments");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const payments = await getCachedPayments();

    return { payments: payments ?? [] };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
