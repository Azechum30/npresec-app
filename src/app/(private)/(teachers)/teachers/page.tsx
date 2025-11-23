import { Metadata } from "next";
import { RenderStudentsTable } from "./_components/render-students-table";
import { fetchStudentsAction } from "./_actions/fetch-students-action";
import { SendClassQueryForm } from "./_forms/send-class-query-form";
import { getAuthUser } from "@/lib/getAuthUser";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "Teachers",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StudentsListPage({ searchParams }: Props) {
  const [searchParamsData, user] = await Promise.all([
    searchParams,
    getAuthUser(),
  ]);

  if (!user) {
    return redirect("/sign-in");
  }

  if (user?.role?.name !== "teacher") {
    const referer = (await headers()).get("referer") || "/";
    return redirect(referer);
  }

  const classId = searchParamsData.classId as string | undefined;

  const result = classId
    ? await fetchStudentsAction(classId)
    : { students: undefined, error: undefined };

  return (
    <div>
      <div className="flex flex-col md:flex-row  gap-3 md:gap-0 md:items-center md:justify-between">
        <h1 className=" text-base font-semibold line-clamp-1">Students List</h1>
        <SendClassQueryForm />
      </div>
      <RenderStudentsTable students={result.students} error={result.error} />
    </div>
  );
}
