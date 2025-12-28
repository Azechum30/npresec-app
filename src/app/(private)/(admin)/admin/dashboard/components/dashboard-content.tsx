"use client";

import * as React from "react";
import { DashboardData } from "../actions/dashboard-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BookOpen,
  GraduationCap,
  Home,
  LucideBuilding2,
  TrendingUp,
  UserPen,
} from "lucide-react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { use, useEffect, useMemo, useState } from "react";
import LoadingState from "@/components/customComponents/Loading";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Cell,
  PieChart,
  Legend,
  Pie,
  LineChart,
  Line,
  Label,
} from "recharts";
import { BaseDataTable } from "@/components/customComponents/BaseDataTable";
import { columns } from "@/app/(private)/(admin)/admin/dashboard/components/DashboardColumns";

const chartOptions = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function DashboardContent({
  promise,
}: {
  promise: Promise<DashboardData>;
}) {
  const promiseData = use(promise);
  const [data, setData] = useState<DashboardData>(promiseData);
  const genderTotals = useMemo(() => {
    return [
      (data?.counts.studentMales as number) ?? 0,
      (data?.counts.studentFemales as number) ?? 0,
    ].reduce((acc, cur) => acc + cur, 0);
  }, [data]);

  if (!data) {
    return <LoadingState />;
  }

  // Prepare data for charts
  const departmentChartData = data.departmentDistribution.map((dept) => ({
    name: dept.name,
    students: dept.studentCount,
  }));

  const classChartData = data.classDistribution.map((cls) => ({
    name: cls.name,
    students: cls.studentCount,
  }));

  const COLORS = ["#0D47A1", "#1976D2", "#2196F3", "#64B5F6", "#BBDEFB"];

  const genderData = [
    {
      name: "Males",
      value: data.counts.studentMales,
      fill: "hsl(var(--chart-5))",
    },
    {
      name: "Females",
      value: data.counts.studentFemales,
      fill: "hsl(var(--chart-1))",
    },
  ];

  const yearGroupDistributionData = [
    {
      name: "Form 1",
      males: data.counts.yearGroupGender.yearOneMales,
      females: data.counts.yearGroupGender.yearOneFemales,
    },
    {
      name: "Form 2",
      males: data.counts.yearGroupGender.yearTwoMales,
      females: data.counts.yearGroupGender.yearTwoFemales,
    },
    {
      name: "Form 3",
      males: data.counts.yearGroupGender.yearThreeMales,
      females: data.counts.yearGroupGender.yearThreeFemales,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Students"
          value={data?.counts.students}
          description="Total enrolled students"
          icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
          trend="up"
        />
        <MetricCard
          title="Teachers"
          value={data.counts.teachers}
          description="Total active teachers"
          icon={<UserPen className="h-5 w-5 text-blue-500" />}
          trend="stable"
        />
        <MetricCard
          title="Departments"
          value={data.counts.departments}
          description="Academic departments"
          icon={<Home className="h-5 w-5 text-blue-500" />}
          trend="up"
        />
        <MetricCard
          title="Classes"
          value={data.counts.classes}
          description="Active classes"
          icon={<LucideBuilding2 className="h-5 w-5 text-blue-500" />}
          trend="down"
        />
        <MetricCard
          title="Courses"
          value={data.counts.courses}
          description="Available courses"
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          className="md:col-span-2 lg:col-span-1"
          trend="up"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Department Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Student Distribution by Department</CardTitle>
            <CardDescription className="text-blue-500/80">
              Visual breakdown of students across departments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartOptions}
              className="min-h-[200px] w-full">
              <BarChart data={departmentChartData}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="opacity-30"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar
                  dataKey="students"
                  name="Students"
                  fill="hsl(var(--chart-5)"
                  radius={[4, 4, 0, 0]}>
                  {departmentChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Class Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Student Distribution by Class</CardTitle>
            <CardDescription className="text-blue-500/80">
              Percentage of students in each class
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartOptions}
              className="min-h-[200px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={classChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#1976D2"
                  dataKey="students"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }>
                  {classChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                  ,
                </Pie>
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Student Distribution by Gender</CardTitle>
            <CardDescription className="text-blue-500/80">
              Percentage of students by gender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                desktop: { label: "Desktop", color: "hsl(var(--primary))" },
              }}
              className="min-h-[200px] w-full">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={genderData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  className="fill-primary"
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }>
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            cx={viewBox.cx}
                            cy={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle">
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold">
                              {genderTotals.toString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground">
                              Students
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend />
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending Gender <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Showing total gender distribution metrics.
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* Year Group Distribution */}

        <Card>
          <CardHeader>
            <CardTitle>Year Group Gender Distribution</CardTitle>
            <CardDescription className="text-blue-800">
              Student gender distribution by Year Groups.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartOptions}
              className="min-h-[200px] w-full">
              <LineChart
                data={yearGroupDistributionData}
                margin={{ left: 12, right: 12 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(-1)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                />
                <Line
                  dataKey="males"
                  type="monotone"
                  stroke="hsl(var(--chart-5))"
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  dataKey="females"
                  type="monotone"
                  stroke="hsl(var(--chart-1)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
          <CardFooter>
            <div className="flex w-full items-start gap-2 text-sm">
              <div className="grid gap-2">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending Gender for each year group{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2 leading-none text-muted-foreground">
                  Showing total gender metrics for all forms.
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Recent Students */}
      <Card className="overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle>Recent Student Enrollments</CardTitle>
            <CardDescription className="text-blue-500/80">
              Recently enrolled students in the system
            </CardDescription>
          </div>
          <Link href="/admin/students">
            <Button
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-400">
              View All
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <BaseDataTable columns={columns} data={data.recentStudents} />
        </CardContent>
      </Card>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: number;
  description: string;
  icon: React.ReactNode;
  className?: string;
  trend?: "up" | "down" | "stable";
};

function MetricCard({
  title,
  value,
  description,
  icon,
  className,
  trend = "stable",
}: MetricCardProps) {
  const trendColors = {
    up: "text-green-500",
    down: "text-red-500",
    stable: "text-blue-500",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    stable: "→",
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold">{value}</div>
          {trend && (
            <span
              className={`text-sm font-medium ${trendColors[trend]} flex items-center`}>
              {trendIcons[trend]} 5%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  );
}
