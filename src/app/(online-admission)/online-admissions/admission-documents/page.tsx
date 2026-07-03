/** biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartHandshake, TriangleAlert } from "lucide-react";
import type { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { DownloadButton } from "./[admissionId]/_components/downnload-buttons";

type Params = {
  searchParams: Promise<{ [key: string]: string }>;
};

export default function AdmissionDocumentsPage({ searchParams }: Params) {
  return (
    <Suspense fallback={<DotMatrixLoader />}>
      <RenderAdmissionDocumentsComponent searchParams={searchParams} />
    </Suspense>
  );
}

const RenderAdmissionDocumentsComponent = async ({ searchParams }: Params) => {
  await connection();

  const { admissionId } = await searchParams;
  const requestHeaders = await headers();

  const url = requestHeaders.get("referrer") ?? "";

  if (!admissionId) redirect(url as Route);

  return (
    <Card className="w-full md:max-w-lg shadow-lg border-t-4 border-t-primary">
      <CardHeader className="border-b pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/25">
            Step 5 of 5 &mdash; Complete
          </span>
        </div>
        <CardTitle className="flex items-center gap-3 mb-2">
          <span className="size-14 flex justify-center items-center rounded-full bg-primary/15 ring-4 ring-primary/15 shrink-0">
            <HeartHandshake className="size-8" />
          </span>
          <h1 className="text-2xl font-bold bg-linear-120 from-primary to-muted-foreground text-transparent bg-clip-text leading-tight">
            Congratulations!
          </h1>
        </CardTitle>
        <CardDescription className="text-justify leading-relaxed text-sm">
          You have been admitted! We are thrilled to have you join us. Click the
          links below to download your required documents. These serve as
          official proof of your admission status.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="flex items-start gap-2 rounded-lg bg-primary/10 border border-primary/75 p-3">
          <span className="text-primary font-bold text-sm shrink-0 flex items-center space-x-1">
            <TriangleAlert className="size-6 text-primary/80" />
            <span className="font-bold text-base">Note:</span>
          </span>
          <p className="text-sm text-primary/90 leading-relaxed">
            Copies of all downloaded documents must be presented to the school
            on the day of reporting.
          </p>
        </div>
        <DownloadButton admissionId={admissionId} />
      </CardContent>
    </Card>
  );
};
