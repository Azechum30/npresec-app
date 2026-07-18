/**biome-ignore-all assist/source/organizeImports: reason */
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { PageHeader } from "@/components/customComponents/page-header";
import { getQueryClient } from "@/components/providers/get-query-client";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { connection } from "next/server";
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
  await connection();
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.ensureQueryData(coursesQueryOptions),
    queryClient.ensureQueryData(departmentsQueryOptions),
    queryClient.ensureQueryData(staffQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
  ]);

  return (
    <>
      <PageHeader
        pageTitle="Manage Courses"
        showAddButton
        buttonText="Add Course"
        modalKey="create-course"
        permission="create:courses"
      />
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
