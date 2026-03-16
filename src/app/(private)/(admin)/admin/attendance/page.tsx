import { getAttendance } from "@/app/(private)/(admin)/admin/attendance/actions/queries";
import { CreateAttendanceDialog } from "@/app/(private)/(admin)/admin/attendance/components/createAttendanceDialog";
import { EditAttendanceDialog } from "@/app/(private)/(admin)/admin/attendance/components/edit-attendance-dialog";
import { RenderAttendanceTable } from "@/app/(private)/(admin)/admin/attendance/components/render-attendance-table";
import { SingleStudentAttendanceDialog } from "@/app/(private)/(admin)/admin/attendance/components/single-student-attendance-dialog";
import { getClassesAction } from "@/app/(private)/(admin)/admin/classes/actions/server-actions";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { connection } from "next/server";
import { Suspense } from "react";

// export const dynamic = "force-dynamic";

export default function AttendancePage() {
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

      <Suspense fallback={<FallbackComponent />}>
        <RenderAttendanceDataTable />
      </Suspense>

      <CreateAttendanceDialog />
      <SingleStudentAttendanceDialog />

      <Suspense>
        <EditAttendanceDialog />
      </Suspense>
    </>
  );
}

const RenderAttendanceDataTable = async () => {
  await connection();
  const promise = await Promise.all([getAttendance(), getClassesAction()]);

  if (promise[0].error) {
    return <ErrorComponent error={promise[0].error} />;
  }

  if (promise[1].error) {
    return <ErrorComponent error={promise[1].error} />;
  }

  if (!promise[0].attendance || !promise[1].data) {
    return <NoDataFound />;
  }

  return (
    <RenderAttendanceTable
      promise={{ attendance: promise[0].attendance, data: promise[1].data }}
    />
  );
};
