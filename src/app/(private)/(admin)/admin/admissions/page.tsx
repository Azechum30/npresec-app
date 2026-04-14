import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { MetricCard } from "@/components/customComponents/metrics-component";
import OpenDialogs from "@/components/customComponents/OpenDialogs";
import {
  FileCheck2,
  GraduationCap,
  TimerIcon,
  UserStarIcon,
} from "lucide-react";
import { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { getPlacedStudents } from "./_actions/server-only-actions";
import { RenderFreshAdmissionFormModal } from "./_components/render-fresh-admission-form";
import { RenderPlacedStudentsTb } from "./_components/render-placed-students-tb";
import { UpdatePlacedStudentRecordsModal } from "./_components/update-placed-student-records-modal";
import { UploadPlacedStudentsProvider } from "./_components/upload-placed-students-provider";

export const metadata: Metadata = {
  title: "Admission List | Presbyterian SHTS",
  description:
    "The page shows the list of students placed to school by the CSSPS.",
};

export default function AdmissionsPage() {
  return (
    <div className="">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-base font-semibold tracking-tight line-clamp-1">
          Placement List
        </h1>
        <OpenDialogs dialogKey="new-admission" title="Add New Student" />
      </div>

      <Suspense fallback={<FallbackComponent />}>
        <RenderPlacedStudentsDataTable />
      </Suspense>
      <RenderFreshAdmissionFormModal />
      <UpdatePlacedStudentRecordsModal />
      <UploadPlacedStudentsProvider />
    </div>
  );
}

const RenderPlacedStudentsDataTable = async () => {
  await connection();

  const res = await getPlacedStudents();

  if (res.error) {
    return <ErrorComponent error={res.error} />;
  }

  return (
    <div className="flex flex-col space-y-6 mt-4">
      {res.stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 border-b-2 pb-6">
          <MetricCard
            title="Completed Online Admission"
            description="Total enrolled students"
            icon={<FileCheck2 />}
            value={res.stats.addmitedCount ?? 0}
            trend={
              res.stats.pendingCount > res.stats.addmitedCount
                ? "down"
                : res.stats.pendingCount === res.stats.addmitedCount
                  ? "stable"
                  : "up"
            }
            className="dark:bg-card border-b-4 sm:border-b-0 sm:border-l-4 border-green-500"
          />
          <MetricCard
            title="Yet to Perform Online Admission"
            description="Total unenrolled students"
            icon={<TimerIcon />}
            value={res.stats?.pendingCount ?? 0}
            trend={
              res.stats.pendingCount > res.stats.addmitedCount
                ? "up"
                : res.stats.pendingCount === res.stats.addmitedCount
                  ? "stable"
                  : "down"
            }
            className="dark:bg-card border-b-4 sm:border-b-0 sm:border-l-4 border-destructive"
          />
          <MetricCard
            title="Male Placed Students"
            description="Total male students"
            icon={<UserStarIcon />}
            value={res.stats.malesCount ?? 0}
            trend={
              res.stats.malesCount > res.stats.femalesCount
                ? "up"
                : res.stats.malesCount === res.stats.femalesCount
                  ? "stable"
                  : "down"
            }
            className="dark:bg-card border-b-4 sm:border-b-0 sm:border-l-4 border-primary"
          />
          <MetricCard
            title="Female Placed Students"
            description="Total female students"
            icon={<GraduationCap />}
            value={res.stats.femalesCount ?? 0}
            trend={
              res.stats.femalesCount > res.stats.malesCount
                ? "up"
                : res.stats.femalesCount === res.stats.malesCount
                  ? "stable"
                  : "down"
            }
            className="dark:bg-card border-b-4 sm:border-b-0 sm:border-l-4 border-primary/55"
          />
        </div>
      )}
      <RenderPlacedStudentsTb data={res.placedStudents} />
    </div>
  );
};
