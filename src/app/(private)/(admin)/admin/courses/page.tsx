/**biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { classQueryOptions } from "../classes/actions/queries";
import { departmentsQueryOptions } from "../departments/actions/queries";
import { staffQueryOptions } from "../staff/actions/queries";
import { coursesQueryOptions } from "./actions/queries";
import CoursesProvider from "./components/CoursesProvider";
import CreateCourseDialog from "./components/create-course-dialog";
import EditCourseDialog from "./components/edit-course-dialog";
import RenderCoursesDataTable from "./components/render-courses-dataTable";

export default async function CoursesPage() {
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(coursesQueryOptions),
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(staffQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
  ]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <h1 className="text-base font-semibold line-clamp-1">Manage Courses</h1>
        <OpenDialogs dialogKey="create-course" title="Add Course" />
      </div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<FallbackComponent />}>
          <RenderCoursesDataTable />
        </Suspense>
      </HydrationBoundary>

      <CoursesProvider />
      <EditCourseDialog />
      <CreateCourseDialog />
    </>
  );
}
