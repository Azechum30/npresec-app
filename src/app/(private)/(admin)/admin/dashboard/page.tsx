import { hasPermissions } from "@/lib/hasPermission";
import { forbidden, redirect, unauthorized } from "next/navigation";
import { getDashboardData } from "./actions/dashboard-data";
import { Suspense } from "react";
import DashboardContent from "./components/dashboard-content";
import { Skeleton } from "@/components/ui/skeleton";
import { getAuthUser } from "@/lib/getAuthUser";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard - NPRESEC SMIS",
};

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const user = await getAuthUser();

  if (!user) return unauthorized();
  if (user.role?.name !== "admin") return forbidden();

  const dashboardDataPromise = getDashboardData();

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground">
        Overview of Nakpanduri Presby SHTS School Management Information System
      </p>

      <Suspense key={"dashboard-data"} fallback={<DashboardSkeleton />}>
        <DashboardContent promise={dashboardDataPromise} />
      </Suspense>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card text-card-foreground shadow-sm"
          >
            <div className="p-6 flex flex-col space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm col-span-2">
          <div className="p-6">
            <Skeleton className="h-7 w-1/4 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6">
            <Skeleton className="h-7 w-1/2 mb-4" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
