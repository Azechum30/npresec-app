import { Suspense } from "react";
import { getTeachers } from "./actions/server";
import EditTeacherDialog from "./components/EditTeacherDialog";
import OpenCreateTeachersButton from "./components/OpenCreateTeachersButton";
import RenderTeacherData from "./components/Render-teacher-data";
import TeacherBulkUploadProvider from "./components/TeacherBulkUploadProvider";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { hasPermissions } from "@/lib/hasPermission";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function TeachersPage() {
  const permissions = await hasPermissions("view:teacher");

  if (!permissions) {
    return redirect("/403");
  }
  const promise = getTeachers();
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <h1 className="font-semibold line-clamp-1">All Teachers</h1>
        <OpenCreateTeachersButton />
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
        <RenderTeacherData initialState={promise} />
      </Suspense>

      <TeacherBulkUploadProvider />
      <EditTeacherDialog />
    </>
  );
}
