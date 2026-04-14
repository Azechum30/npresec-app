import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { Route } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";

type Params = {
  searchParams: Promise<{ [key: string]: string }>;
};
export default function AdmissionDocumentsPage({ searchParams }: Params) {
  return (
    <>
      <Suspense fallback={<ShowLoadingState />}>
        <RenderAdmissionDocumentsComponent searchParams={searchParams} />
      </Suspense>
    </>
  );
}

const RenderAdmissionDocumentsComponent = async ({ searchParams }: Params) => {
  await connection();

  const { admissionId } = await searchParams;
  const requestHeaders = await headers();

  const url = requestHeaders.get("referer") ?? "";

  if (!admissionId) redirect(url as Route);

  return <div>{admissionId}</div>;
};
