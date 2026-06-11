"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import * as Sentry from "@sentry/nextjs";
import "server-only";
import { getCachedServices } from "../_utils/get-cached-services";

export const getServicesAction = async () => {
  try {
    const { hasPermission } = await getUserPermissions("view:services");
    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const services = await getCachedServices();

    return { services: services ?? [] };
  } catch (e) {
    console.error(e);
    Sentry.captureException(e);
    return { error: getErrorMessage(e) };
  }
};
