import { Button, buttonVariants } from "@/components/ui/button";
import { Download, PrinterCheck } from "lucide-react";
import Link from "next/link";

export const DownloadButton = ({ admissionId }: { admissionId: string }) => {
  return (
    <div className="flex flex-col gap-2.5">
      <Link
        href={`/api/online-admission/downloads?admissionId=${admissionId}`}
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
      <Button
        size="lg"
        variant="outline"
        className="w-full justify-start gap-3 h-14">
        <span className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0">
          <PrinterCheck className="size-4" />
        </span>
        <div className="text-left">
          <div className="font-semibold text-sm">Admission Letter</div>
          <div className="text-xs text-muted-foreground">
            Official admission notice
          </div>
        </div>
      </Button>
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
