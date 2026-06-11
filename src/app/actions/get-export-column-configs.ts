"use server";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { prisma } from "@/lib/prisma";
import { ColumnConfigItem } from "@/hooks/use-export-column-config-store";
import "server-only";

export type ExportColumnConfigRecord = {
  exportKey: string;
  columns: ColumnConfigItem[];
};

export const getExportColumnConfigs = async (): Promise<{
  data?: ExportColumnConfigRecord[];
  error?: string;
}> => {
  try {
    const records = await prisma.exportColumnConfig.findMany();
    return {
      data: records.map((r) => ({
        exportKey: r.exportKey,
        columns: r.columns as ColumnConfigItem[],
      })),
    };
  } catch (e) {
    console.error(e);
    return { error: getErrorMessage(e) };
  }
};
