"use client";

import xlsx, { IContent } from "json-as-xlsx";
import { Button } from "../ui/button";
import { CloudDownloadIcon } from "lucide-react";
import { useAuth } from "./SessionProvider";
import { cn } from "@/lib/utils";

type ExportXLSXProps<T> = {
  data: T[];
  filename?: string;
};

export const ExportAsExcel = <T extends IContent>({
  data,
  filename,
}: ExportXLSXProps<T>) => {
  const user = useAuth();

  if (!(user.role?.name == "admin" || user.role?.name == "teacher"))
    return null;

  const handleExport = () => {
    const settings = {
      fileName: filename || "export",
      extraLength: 3,
      writeOptions: {},
    };

    const formattedData = [
      {
        sheet: "Sheet 1",
        columns: Object.keys(data[0]).map((key) => ({
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
      Excel
    </Button>
  );
};
