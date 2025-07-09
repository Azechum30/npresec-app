import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { CreateAttendanceDialog } from "@/app/(private)/admin/attendance/components/createAttendanceDialog";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { RenderAttendanceTable } from "@/app/(private)/admin/attendance/components/render-attendance-table";
import { getAttendance } from "@/app/(private)/admin/attendance/actions/queries";
import { getClassesAction } from "@/app/(private)/admin/classes/actions/server-actions";
import { SingleStudentAttendanceDialog } from "@/app/(private)/admin/attendance/components/single-student-attendance-dialog";
import { EditAttendanceDialog } from "@/app/(private)/admin/attendance/components/edit-attendance-dialog";
import { getAuthUser } from "@/lib/getAuthUser";
import { headers } from "next/headers";

export default async function AttendancePage() {
  const user = await getAuthUser();
  if (!user || user.role?.name !== "admin") {
    const referer = (await headers()).get("referer") || "/admin/dashboard";
    return redirect(referer);
  }

  const promise = Promise.all([getAttendance(), getClassesAction()]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <h1 className="font-semibold text-lg">Attendance</h1>
        <div className="flex flex-col md:flex-row gap-2">
          <OpenDialogs dialogKey="createAttendance" title="Mark a Class" />
          <OpenDialogs
            dialogKey="createSingleAttendance"
            title="Mark Single Student"
            variant="destructive"
          />
        </div>
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
        <RenderAttendanceTable promise={promise} />
      </Suspense>

      <CreateAttendanceDialog />
      <SingleStudentAttendanceDialog />

      <Suspense>
        <EditAttendanceDialog />
      </Suspense>
    </>
  );
}
