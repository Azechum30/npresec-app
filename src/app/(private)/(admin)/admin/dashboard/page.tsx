import { Suspense } from "react";
import { DashboardData, getDashboardData } from "./actions/dashboard-data";
import DashboardContent from "./components/dashboard-content";

import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";

export const metadata: Metadata = {
  title: "Admin Dashboard - NPRESEC SMIS",
};

// export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Overview of Nakpanduri Presby SHTS School Management Information System
      </p>

      <Suspense fallback={<FallbackComponent />}>
        <RenderAdminDashboard />
      </Suspense>
    </div>
  );
}

const RenderAdminDashboard = async () => {
  await connection();
  const dashboardDataPromise = await getDashboardData();

  const { error, ...rest } = dashboardDataPromise;

  if (error) {
    redirect("/403");
  }

  return <DashboardContent promise={rest as DashboardData} />;
};
