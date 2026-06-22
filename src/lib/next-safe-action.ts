import * as Sentry from "@sentry/nextjs";
import { ActionError, CUSTOM_ERRORS } from "./constants";
import { getUserPermissions } from "./get-session";
import { getErrorMessage } from "./getErrorMessage";

type ActionOptions = {
  permission?: string;
};
export const nextSafeAction = async <T>(
  fn: () => Promise<T>,
  options?: ActionOptions,
): Promise<T> => {
  try {
    if (options?.permission) {
      const { user, hasPermission } = await getUserPermissions(
        options.permission,
      );

      if (!user) throw new ActionError(CUSTOM_ERRORS.AUTHENTICATION.message);
      if (!hasPermission)
        throw new ActionError(CUSTOM_ERRORS.AUTHORIZATION.message);
    }
    return await fn();
  } catch (error) {
    Sentry.captureException(error);
    throw getErrorMessage(error);
  }
};
