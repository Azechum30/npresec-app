"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { pusher } from "@/lib/pusher";
import "server-only";

type TSettings = {
  enableEditing?: boolean;
  enableDeleting?: boolean;
  enableScoresEntry?: boolean;
  enableDataExports?: boolean;
};

export const updateSystemSettings = async (values: TSettings) => {
  try {
    const { hasPermission } = await getUserPermissions("create:users");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const data: Partial<TSettings> = {};
    if (typeof values.enableEditing === "boolean")
      data.enableEditing = values.enableEditing;
    if (typeof values.enableDeleting === "boolean")
      data.enableDeleting = values.enableDeleting;
    if (typeof values.enableScoresEntry === "boolean")
      data.enableScoresEntry = values.enableScoresEntry;
    if (typeof values.enableDataExports === "boolean")
      data.enableDataExports = values.enableDataExports;

    const current = await prisma.setting.findFirst();

    let updated;
    if (!current) {
      updated = await prisma.setting.create({ data });
    } else {
      updated = await prisma.setting.update({
        where: { id: current.id },
        data,
      });
    }

    await pusher.trigger("system-settings", "settings-updated", updated);
    return { data: updated };
  } catch (e) {
    console.error(e);
    return { error: getErrorMessage(e) };
  }
};
