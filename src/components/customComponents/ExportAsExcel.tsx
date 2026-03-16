"use client";

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
};

// Internal component that handles the actual export logic
const ExportAsExcelInternal = <T extends IContent>({
  data,
  filename,
  className,
}: ExportXLSXProps<T>) => {
  const user = useAuth();

  // Check if user has permission

  const requiredRoles = ["admin", "teaching_staff"];
  const userRoles = user?.roles?.map((r) => r.role?.name).filter(Boolean) ?? [];

  const hasRole = requiredRoles.some((r) => userRoles.includes(r));

  // Don't render if no permission
  if (!hasRole) {
    return null;
  }

  const handleExport = () => {
    if (!hasRole || data.length === 0) return;

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
        data.length === 0 && "pointer-events-none disabled:pointer-events-none",
        className
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
