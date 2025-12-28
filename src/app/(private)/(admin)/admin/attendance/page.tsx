import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { CreateAttendanceDialog } from "@/app/(private)/(admin)/admin/attendance/components/createAttendanceDialog";
import { Suspense } from "react";
import { RenderAttendanceTable } from "@/app/(private)/(admin)/admin/attendance/components/render-attendance-table";
import { getAttendance } from "@/app/(private)/(admin)/admin/attendance/actions/queries";
import { getClassesAction } from "@/app/(private)/(admin)/admin/classes/actions/server-actions";
import { SingleStudentAttendanceDialog } from "@/app/(private)/(admin)/admin/attendance/components/single-student-attendance-dialog";
import { EditAttendanceDialog } from "@/app/(private)/(admin)/admin/attendance/components/edit-attendance-dialog";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";

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
