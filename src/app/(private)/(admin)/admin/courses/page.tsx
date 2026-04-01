import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { connection } from "next/server";
import { Suspense } from "react";
import { getCourses } from "./actions/actions";
import CoursesProvider from "./components/CoursesProvider";
import CreateCourseDialog from "./components/create-course-dialog";
import EditCourseDialog from "./components/edit-course-dialog";
import RenderCoursesDataTable from "./components/render-courses-dataTable";

// export const dynamic = "force-dynamic";

export default function CoursesPage() {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <h1 className="text-base font-semibold line-clamp-1">All Courses</h1>
        <OpenDialogs dialogKey="createCourse" title="Add a new Course" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderCoursesTable />
      </Suspense>

      <CoursesProvider />
      <EditCourseDialog />
      <CreateCourseDialog />
    </div>
  );
}

const RenderCoursesTable = async () => {
  await connection();
  const courses = await getCourses();
  return <RenderCoursesDataTable initialState={courses} />;
};
