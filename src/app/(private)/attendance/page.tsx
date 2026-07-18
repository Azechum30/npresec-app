/**biome-ignore-all assist/source/organizeImports: reason */

import { RenderAttendanceTable } from "@/app/(private)/attendance/components/render-attendance-table";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { getQueryClient } from "@/components/providers/get-query-client";
import { RoleService } from "@/lib/services/role-check-service";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { classQueryOptions } from "../(admin)/admin/classes/actions/queries";
import { attendanceQueryOptions } from "./actions/queries";
import { AttendanceDialogsProvider } from "./components/attendance-dialogs-provider";

export const metadata: Metadata = {
  title: "Track Students Attendance",
  description: "An easy way to track the daily attendance rates of students.",
  keywords: ["Track Attendance", "Presby SHTS Nakpanduri"],
};

export default function AttendancePage() {
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 md:space-y-0">
        <h1 className="font-bold text-xl bg-linear-to-r from-primary to-muted-foreground dark:to-accent bg-clip-text text-transparent line-clamp-1">
          Manage Attendance
        </h1>
        <div className="flex flex-col md:flex-row gap-2">
          <OpenDialogs
            dialogKey="create-attendance"
            title="Add Class Attendance"
            permission="create:attendance"
          />
          <OpenDialogs
            dialogKey="create-single-attendance"
            title="Add Student Attendance"
            variant="secondary"
            permission="create:attendance"
          />
        </div>
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderAttendanceWithData />
      </Suspense>

      <AttendanceDialogsProvider />
    </>
  );
}

const RenderAttendanceWithData = async () => {
  await connection();
  const { serverSideHasRole } = new RoleService(["admin", "classTeacher"]);

  const hasAttendanceRolePermissions = await serverSideHasRole();
  if (!hasAttendanceRolePermissions) redirect("/403");

  const queryClient = getQueryClient();

  await Promise.all([
    // queryClient.ensureQueryData(studentsQueryOptions),
    queryClient.ensureQueryData(classQueryOptions),
    queryClient.ensureQueryData(attendanceQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <RenderAttendanceTable />
    </HydrationBoundary>
  );
};
