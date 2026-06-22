/**biome-ignore-all assist/source/organizeImports: reason */

import { CreateAttendanceDialog } from "@/app/(private)/attendance/components/createAttendanceDialog";
import { EditAttendanceDialog } from "@/app/(private)/attendance/components/edit-attendance-dialog";
import { RenderAttendanceTable } from "@/app/(private)/attendance/components/render-attendance-table";
import { SingleStudentAttendanceDialog } from "@/app/(private)/attendance/components/single-student-attendance-dialog";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { getUserRole } from "@/lib/get-session";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { classQueryOptions } from "../(admin)/admin/classes/actions/queries";
import { studentsQueryOptions } from "../(admin)/admin/students/actions/queries";
import { attendanceQueryOptions } from "./actions/queries";

export default async function AttendancePage() {
  const queryClient = getQueryClient();

  const [_, __, ___, roles] = await Promise.all([
    queryClient.ensureQueryData(studentsQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(attendanceQueryOptions()),
    getUserRole(),
  ]);

  if (!roles) return redirect("/403");

  const userRoles = new Set(roles.map((role) => role));

  const hasAttendancePermission =
    userRoles.has("admin") || userRoles.has("classTeacher");

  if (!hasAttendancePermission) redirect("/403");

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <h1 className="font-semibold text-lg line-clamp-1">
          Manage Attendance
        </h1>
        <div className="flex flex-col md:flex-row gap-2">
          <OpenDialogs
            dialogKey="create-attendance"
            title="Add Class Attendance"
          />
          <OpenDialogs
            dialogKey="create-single-attendance"
            title="Add Student Attendance"
            variant="secondary"
          />
        </div>
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <RenderAttendanceTable />
        </HydrationBoundary>
      </Suspense>

      <CreateAttendanceDialog />
      <SingleStudentAttendanceDialog />
      <EditAttendanceDialog />
    </>
  );
}
