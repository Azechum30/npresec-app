"use server";
import { ActionError, CUSTOM_ERRORS } from "@/lib/constants";
import { getUserPermissions } from "@/lib/get-session";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { ColumnConfigItem } from "@/hooks/use-export-column-config-store";
import "server-only";

export const saveExportColumnConfig = async (
  exportKey: string,
  columns: ColumnConfigItem[],
): Promise<{ data?: { exportKey: string; columns: ColumnConfigItem[] }; error?: string }> => {
  try {
    const { hasPermission } = await getUserPermissions("create:users");

    if (!hasPermission)
      throw new ActionError(
        CUSTOM_ERRORS.AUTHORIZATION.message,
        CUSTOM_ERRORS.AUTHORIZATION.status,
        CUSTOM_ERRORS.AUTHORIZATION.code,
      );

    const record = await prisma.exportColumnConfig.upsert({
      where: { exportKey },
      create: { exportKey, columns: columns as object[] },
      update: { columns: columns as object[] },
    });

    return {
      data: {
        exportKey: record.exportKey,
        columns: record.columns as ColumnConfigItem[],
      },
    };
  } catch (e) {
    console.error(e);
    return { error: getErrorMessage(e) };
  }
};
