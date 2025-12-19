import OpenDialogs from "@/components/customComponents/OpenDialogs";
import RenderCoursesDataTable from "./components/render-courses-dataTable";
import { getCourses } from "./actions/actions";
import EditCourseDialog from "./components/edit-course-dialog";
import CoursesProvider from "./components/CoursesProvider";
import { Suspense } from "react";
import CreateCourseDialog from "./components/create-course-dialog";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

export default function CoursesPage() {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <h1 className="text-base font-semibold line-clamp-1">All Courses</h1>
        <OpenDialogs dialogKey="createCourse" />
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

export const RenderCoursesTable = async () => {
  const courses = await getCourses();
  return <RenderCoursesDataTable initialState={courses} />;
};
