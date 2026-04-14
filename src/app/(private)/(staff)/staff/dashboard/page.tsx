import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { connection } from "next/server";
import { Suspense } from "react";
import { getStaffDashboardData } from "./_actions/actions";
import { RenderStaffPersonalizedDashboard } from "./_components/render-staff-personalized-dashboard";

function StaffDashboardPage() {
  return (
    <div>
      <div className="flex flex-col space-y-1 mb-6">
        <h1 className="text-2xl font-bold tracking-tighter mb-0">
          Personalized Dashboard
        </h1>
        <p className="text-sm font-mono bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent">
          Get realtime, personalized and actionable insights from the system.
        </p>
      </div>
      <Suspense fallback={<FallbackComponent />}>
        <RenderStaffPersonalizedDashboardComponent />
      </Suspense>
    </div>
  );
}

export default StaffDashboardPage;

const RenderStaffPersonalizedDashboardComponent = async () => {
  await connection();
  const result = await getStaffDashboardData();

  if (result.error) {
    return <ErrorComponent error={result.error} />;
  }
  return (
    <RenderStaffPersonalizedDashboard
      data={{
        classCount: result.classCount ?? 0,
        courseCount: result.courseCount ?? 0,
        studentCount: result.studentCount ?? 0,
        averages: result.averages,
        maximums: result.maximums,
        atRiskStudents: result.atRiskStudents,
      }}
    />
  );
};
