/**biome-ignore-all assist/source/organizeImports:reason */
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, PrinterCheck } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

export const DownloadButton = ({ admissionId }: { admissionId: string }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <Link
        prefetch={false}
        href={
          `/api/online-admissions/downloads/enrollment-summary?admissionId=${admissionId}` as Route
        }
        download={true}
        className={buttonVariants({
          variant: "default",
          size: "lg",
          className: "w-full justify-start gap-3 h-14",
        })}>
        <span className="size-8 rounded-md bg-primary-foreground/15 flex items-center justify-center shrink-0">
          <Download className="size-4" />
        </span>
        <div className="text-left">
          <div className="font-semibold text-sm">Enrollment Form</div>
          <div className="text-xs opacity-75">PDF document</div>
        </div>
      </Link>
      <Link
        download={true}
        prefetch={false}
        href={`/api/online-admissions/downloads/admission-letter?admissionId=${admissionId}`}
        className={buttonVariants({
          size: "lg",
          variant: "outline",
          className: "w-full justify-start gap-3 h-14",
        })}>
        <span className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
          <PrinterCheck className="size-4" />
        </span>
        <div className="text-left">
          <div className="font-semibold text-sm">Admission Letter</div>
          <div className="text-xs text-muted-foreground">
            Official admission notice
          </div>
        </div>
      </Link>
      <Button
        size="lg"
        variant="outline"
        className="w-full justify-start gap-3 h-14">
        <span className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
          <Download className="size-4" />
        </span>
        <div className="text-left">
          <div className="font-semibold text-sm">Acceptance Letter</div>
          <div className="text-xs text-muted-foreground">
            Confirmation document
          </div>
        </div>
      </Button>
    </div>
  );
};
