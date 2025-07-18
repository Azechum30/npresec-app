import OpenDialogs from "@/components/customComponents/OpenDialogs";
import RenderCoursesDataTable from "./components/render-courses-dataTable";
import { getCourses } from "./actions/actions";
import EditCourseDialog from "./components/edit-course-dialog";
import CoursesProvider from "./components/CoursesProvider";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { redirect } from "next/navigation";
import CreateCourseDialog from "./components/create-course-dialog";
import { getAuthUser } from "@/lib/getAuthUser";
import { headers } from "next/headers";

export default async function CoursesPage() {
  const user = await getAuthUser();
  if (!user || user.role?.name !== "admin") {
    const referer = (await headers()).get("referer") || "/sign-in";
    return redirect(referer);
  }
  const promise = getCourses();

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <h1 className="text-base font-semibold line-clamp-1">All Courses</h1>
        <OpenDialogs dialogKey="createCourse" />
      </div>

      <Suspense
        fallback={
          <DataTableSkeleton
            columnCount={7}
            filterCount={2}
            cellWidths={[
              "10rem",
              "30rem",
              "10rem",
              "10rem",
              "6rem",
              "6rem",
              "6rem",
            ]}
            shrinkZero
          />
        }>
        <RenderCoursesDataTable initialState={promise} />
      </Suspense>

      <CoursesProvider />
      <EditCourseDialog />
      <CreateCourseDialog />
    </div>
  );
}
