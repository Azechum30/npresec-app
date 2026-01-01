import { Metadata } from "next";
import { RenderStudentsTable } from "./_components/render-students-table";
import { fetchStudentsAction } from "./_actions/fetch-students-action";
import { SendClassQueryForm } from "./_forms/send-class-query-form";
import { getAuthUser } from "@/lib/get-session";
import { Suspense } from "react";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Teachers",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function StudentsListPage({ searchParams }: Props) {
  return (
    <div>
      <div className="flex flex-col md:flex-row  gap-3 md:gap-0 md:items-center md:justify-between">
        <h1 className=" text-base font-semibold line-clamp-1">Students List</h1>
        <SendClassQueryForm />
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <StaffAssignedStudentsTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const StaffAssignedStudentsTable = async ({ searchParams }: Props) => {
  const [searchParamsData, user] = await Promise.all([
    searchParams,
    getAuthUser(),
  ]);

  const classId = searchParamsData.classId as string | undefined;

  const result = classId
    ? await fetchStudentsAction(classId)
    : { students: undefined, error: undefined };
  return (
    <RenderStudentsTable students={result.students} error={result.error} />
  );
};
