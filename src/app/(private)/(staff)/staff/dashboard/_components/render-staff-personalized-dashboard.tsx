"use client";

import { BarchartComponent } from "@/components/customComponents/bar-chart-component";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { MetricCard } from "@/components/customComponents/metrics-component";
import { Notification } from "@/components/customComponents/notification";
import { RealtimeMetricsDashboard } from "@/components/customComponents/PerformanceMetrics";
import { AtRiskStudentsType } from "@/lib/types";
import { BookPlusIcon, Building2, LucideUsers2 } from "lucide-react";
import { AtRiskStudents } from "./at-ristk-students";

type DashboardProps = {
  data?: {
    classCount: number;
    courseCount: number;
    studentCount: number;
    averages?: {
      courseName: string;
      className: string;
      academicYear: number;
      semester: string;
      total: number;
      Assignment: number;
      Midterm: number;
      Project: number;
      Examination: number;
    }[];
    maximums?: {
      courseName: string;
      className: string;
      academicYear: number;
      semester: string;
      total: number;
      Assignment: number;
      Midterm: number;
      Project: number;
      Examination: number;
    }[];
    atRiskStudents?: AtRiskStudentsType[];
  };
  error?: string;
};

export const RenderStaffPersonalizedDashboard = ({
  data,
  error,
}: DashboardProps) => {
  return (
    <>
      {error && <ErrorComponent error={error} />}
      {data ? (
        <div className="flex flex-col space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <MetricCard
              title="Students"
              icon={<LucideUsers2 />}
              description="Students Assigned"
              value={data.studentCount}
              trend={
                data.studentCount >= 100
                  ? "up"
                  : data.studentCount >= 50
                    ? "stable"
                    : "down"
              }
            />
            <MetricCard
              title="Classes"
              icon={<Building2 />}
              description="Classes Assigned"
              value={data.classCount}
              trend={
                data.classCount >= 5
                  ? "up"
                  : data.classCount >= 3
                    ? "stable"
                    : "down"
              }
            />
            <MetricCard
              title="Courses"
              icon={<BookPlusIcon />}
              description="Courses Assigned"
              value={data.courseCount}
              trend={
                data.courseCount >= 5
                  ? "up"
                  : data.courseCount >= 3
                    ? "stable"
                    : "down"
              }
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            {data.averages && (
              <div className="flex-1">
                <RealtimeMetricsDashboard
                  data={data.averages}
                  title="Average Performance"
                />
              </div>
            )}
            {data.maximums && (
              <div className="flex-1">
                <BarchartComponent data={data.maximums} />
              </div>
            )}
          </div>
          <AtRiskStudents data={data.atRiskStudents} />
        </div>
      ) : (
        <Notification description="No dashboard data found." />
      )}
    </>
  );
};
