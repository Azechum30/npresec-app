"use client";

import dynamic from "next/dynamic";
import xlsx, { IContent } from "json-as-xlsx";
import { Button } from "../ui/button";
import { CloudDownloadIcon } from "lucide-react";
import { useAuth } from "./SessionProvider";
import { cn } from "@/lib/utils";

type ExportXLSXProps<T> = {
  data: T[];
  filename?: string;
};

// Internal component that handles the actual export logic
const ExportAsExcelInternal = <T extends IContent>({
  data,
  filename,
}: ExportXLSXProps<T>) => {
  const user = useAuth();

  // Check if user has permission
  const hasPermission =
    user && (user.role?.name === "admin" || user.role?.name === "teacher");

  // Don't render if no permission
  if (!hasPermission) {
    return null;
  }

  const handleExport = () => {
    if (!hasPermission || data.length === 0) return;

    const settings = {
      fileName: filename || "export",
      extraLength: 3,
      writeOptions: {},
    };

    const formattedData = [
      {
        sheet: filename ?? "Sheet 1",
        columns: Object.keys(data[0] || {}).map((key) => ({
          label: key,
          value: key,
        })),
        content: data,
      },
    ];

    xlsx(formattedData, settings);
  };

  return (
    <Button
      variant="outline"
      onClick={handleExport}
      className={cn(
        data.length === 0 && "pointer-events-none disabled:pointer-events-none"
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
    loading: () => null, // Don't show loading state to avoid layout shift
  }
) as typeof ExportAsExcelInternal;
