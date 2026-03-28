"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SheetIcon, UploadCloud, UploadCloudIcon, X } from "lucide-react";
import { useCSVReader } from "react-papaparse";

import LoadingButton from "@/components/customComponents/LoadingButton";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import BaseTable from "../../app/(private)/(admin)/admin/departments/components/BaseTable";
import { useGenericDialog } from "../../hooks/use-open-create-teacher-dialog";

type onUpload = Promise<{
  errors?: string[];
  count?: number;
  error?: string;
  success?: boolean;
}>;
type UploadProps<T> = {
  handleUploadAction: (data: T) => onUpload;
  filepath?: string;
};

export default function UploadComponent<T>({
  handleUploadAction,
  filepath,
}: UploadProps<T>) {
  const { dialogs, onClose } = useGenericDialog();
  const { CSVReader } = useCSVReader();

  const [data, setData] = useState<{ data: any[] } | undefined>();
  const [columns, setColumns] = useState([]);

  const [isPending, startTransition] = useTransition();
  const pathname = usePathname().split("/").pop();

  const formatPath = `${pathname?.charAt(0).toUpperCase()}${pathname?.slice(
    1,
  )}`;

  function onFileUploadAccepted(results: any) {
    const headers = results.data[0].map((header: string) => ({
      header: header.trim(),
      accessorKey: header,
    }));

    const rows = results.data
      .slice(1)
      .filter((row: any[]) =>
        row.some((cell) => cell?.toString().trim() !== ""),
      )
      .map((row: any[]) =>
        row.reduce((acc: any, curr: any, index: number) => {
          const key = headers[index]?.accessorKey;
          if (key) {
            acc[key] = curr?.toString().trim() || "";
          }
          return acc;
        }, {}),
      );

    setColumns(headers);
    setData((prev) => ({ ...prev, data: rows }));
  }

  const dialogId = pathname + "-upload";

  function SaveToDatabase() {
    startTransition(async () => {
      const response = await handleUploadAction(data as any);

      if (response?.errors) {
        console.log(response.errors);
        response.errors.forEach((e) => {
          toast.error(e);
        });
        // toast.error(response.errors.join("\n"));
      } else if (response.error) {
        console.log(response.error);
        toast.error(response?.error);
      } else {
        toast.success(
          `${response?.count} were succussfully queued for processing!`,
        );

        setTimeout(() => {
          setData(undefined);
          setColumns([]);
          onClose(dialogId);
        }, 300);
      }
    });
  }

  const handleCancel = () => {
    setData(undefined);
    setColumns([]);
    onClose(dialogId);
  };

  return (
    <Dialog
      open={dialogs[dialogId] === true ? true : false}
      onOpenChange={() => onClose(dialogId)}
      modal={true}>
      {dialogId && (
        <DialogContent
          className={cn(
            data?.data?.length! > 0 &&
              "md:max-w-full md:max-h-full mx-auto transition-transform delay-300 ease-linear",
          )}>
          <DialogHeader>
            <DialogTitle>Select a CSV File of {formatPath}</DialogTitle>
            <DialogDescription className="italic underline">
              Read the instructions carefully for a smooth data upload:
            </DialogDescription>
          </DialogHeader>
          <ul className="list-disc ml-4 text-sm text-muted-foreground ">
            <li className="leading-6">
              The file format should be an excel file formatted and saved as a
              Comma Separated Values (CSV) file.
            </li>
            <li className="leading-6">
              Ensure the column headers are properly named with the casing the
              server expects. If in doubt contact the System&apos;s
              Administrator.
            </li>
            <li className="leading-6">
              To avoid confusion or unncessary errors, there is a template CSV
              file below which you can download and use to capture your data.
            </li>
            <li className="leading-6">
              Kindly click on{" "}
              <a href={`/${filepath}`} download className="text-primary">
                {pathname?.toUpperCase()} CSV
              </a>{" "}
              to download the sample file.
            </li>
          </ul>
          <div className="border border-dashed rounded-md p-1.5 max-h-[65vh] w-full overflow-y-auto scrollbar-thin">
            <CSVReader onUploadAccepted={onFileUploadAccepted}>
              {({
                getRootProps,
                acceptedFile,
                ProgressBar,
                getRemoveFileProps,
              }: any) => (
                <>
                  <div
                    className={cn(
                      "w-full max-w-md mx-auto rounded-2xl h-[200px] border-2 border-dashed flex flex-col justify-center items-center gap-2 hover:cursor-pointer relative p-6",
                      data?.data.length! > 0 && "max-w-full h-auto",
                    )}>
                    <Button
                      {...getRootProps()}
                      variant="ghost"
                      className={cn(
                        "text-muted-foreground w-full h-full",
                        acceptedFile && "w-1/2  mx-auto h-auto",
                      )}>
                      <UploadCloudIcon />
                      Browse
                    </Button>
                    {acceptedFile && (
                      <div className="flex items-center gap-x-1 text-sm text-muted-foreground">
                        <SheetIcon />
                        <span className="text-base">{acceptedFile.name}</span>
                      </div>
                    )}
                    {acceptedFile && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-5 right-5"
                        {...getRemoveFileProps()}>
                        <X className="text-red-400" />
                      </Button>
                    )}
                    <ProgressBar
                      style={{
                        backgroundColor: "#f87171",
                        height: "3px",
                      }}
                    />
                  </div>
                </>
              )}
            </CSVReader>
            {data && data.data.length !== 0 ? (
              <>
                <div
                  className={cn(
                    "mt-4 rounded-md border w-full ",
                    data.data.length > 0 && "max-w-full  ",
                  )}>
                  <BaseTable columns={columns} data={data.data} />
                </div>

                <div className="mt-4 flex flex-col md:flex-row md:justify-end md:items-center md:space-x-4 space-y-4 md:space-y-0">
                  <LoadingButton
                    className="w-auto"
                    loading={isPending}
                    onClick={SaveToDatabase}>
                    <UploadCloud className="size-5" />
                    Push to Database
                  </LoadingButton>

                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
