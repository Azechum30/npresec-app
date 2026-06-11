"use client";

import { useExportColumnConfigStore } from "@/hooks/use-export-column-config-store";
import { cn } from "@/lib/utils";
import xlsx, { IContent } from "json-as-xlsx";
import { CloudDownloadIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { Button } from "../ui/button";
import { useAuth } from "./SessionProvider";

type ExportXLSXProps<T> = {
  data: T[];
  filename?: string;
  className?: string;
  exportKey?: string;
};

const ExportAsExcelInternal = <T extends IContent>({
  data,
  filename,
  className,
  exportKey,
}: ExportXLSXProps<T>) => {
  const user = useAuth();
  const getEnabledKeys = useExportColumnConfigStore((s) => s.getEnabledKeys);

  const requiredRoles = ["admin", "teaching_staff"];
  const userRoles = user?.roles?.map((r) => r.role?.name).filter(Boolean) ?? [];

  const hasRole = requiredRoles.some((r) => userRoles.includes(r));

  if (!hasRole) {
    return null;
  }

  const handleExport = () => {
    if (!hasRole || data.length === 0) return;

    const enabledKeys = exportKey ? getEnabledKeys(exportKey) : null;

    const allKeys = Object.keys(data[0] || {});
    const columnKeys = enabledKeys
      ? allKeys.filter((k) => enabledKeys.includes(k))
      : allKeys;

    const settings = {
      fileName: filename || "export",
      extraLength: 3,
      writeOptions: {},
    };

    const formattedData = [
      {
        sheet: filename ?? "Sheet 1",
        columns: columnKeys.map((key) => ({ label: key, value: key })),
        content: data,
      },
    ];

    xlsx(formattedData, settings);
  };

  return (
    <Button
      onClick={handleExport}
      className={cn(
        data.length === 0 && "pointer-events-none disabled:pointer-events-none",
        className,
      )}
      disabled={data.length === 0}>
      <CloudDownloadIcon className="size-5" />
      Export As XLSX
    </Button>
  );
};

// Dynamic component with SSR disabled to prevent hydration issues
export const ExportAsExcel = dynamic(
  () => Promise.resolve(ExportAsExcelInternal),
  {
    ssr: false,
    loading: () => null,
  },
) as typeof ExportAsExcelInternal;
