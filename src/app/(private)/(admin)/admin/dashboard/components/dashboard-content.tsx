/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { columns } from "@/app/(private)/(admin)/admin/dashboard/components/DashboardColumns";
import { BaseDataTable } from "@/components/customComponents/BaseDataTable";
import LoadingState from "@/components/customComponents/Loading";
import { MetricCard } from "@/components/customComponents/metrics-component";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BookOpen,
  GraduationCap,
  Home,
  LucideBuilding2,
  TrendingUp,
  UserPen,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  type BarShapeProps,
  CartesianGrid,
  Label,
  LabelList,
  type LabelProps,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import type { DashboardData } from "../actions/dashboard-data";

const chartOptions = {
  students: {
    label: "Students",
    color: "var(--chart-1)",
  },
  males: {
    label: "Males",
    color: "var(--chart-5)",
  },
  females: {
    label: "Females",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

const COLORS = [
  "var(--chart-1)", // Primary Copper/Orange
  "var(--chart-2)", // Vibrant Purple/Blue
  "var(--chart-5)", // Secondary Copper
  "var(--chart-4)", // Deep Muted Purple
  "var(--chart-3)", // Accent Gray/Neutral
];

const getPath = (x: number, y: number, width: number, height: number) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

const TriangleBar = (props: BarShapeProps) => {
  const { x, y, width, height, index } = props;

  const color = COLORS[index % COLORS.length];

  return (
    <path
      strokeWidth={props.isActive ? 5 : 0}
      d={getPath(Number(x), Number(y), Number(width), Number(height))}
      stroke={color}
      fill={color}
      style={{
        transition: "stroke-width 0.3s ease-out",
      }}
    />
  );
};

const CustomColorLabel = (props: LabelProps) => {
  const fill = COLORS[(props.index ?? 0) % COLORS.length];
  return <Label {...props} fill={fill} />;
};

export default function DashboardContent({
  promise,
}: {
  promise: DashboardData;
}) {
  const [data, __] = useState<DashboardData>(() => promise);
  const genderTotals = useMemo(() => {
    return [
      (data?.counts.studentMales as number) ?? 0,
      (data?.counts.studentFemales as number) ?? 0,
    ].reduce((acc, cur) => acc + cur, 0);
  }, [data]);

  if (!data) {
    return <LoadingState />;
  }

  const departmentChartData = data.departmentDistribution
    .map((dept) => ({
      name: dept.name,
      students: dept.studentCount,
    }))
    .filter(
      (dept) =>
        dept.students > 0 &&
        dept.name !== "ICT" &&
        dept.name !== "Mathematics" &&
        dept.name !== "Languages" &&
        dept.name !== "Science",
    );

  const classChartData = data.classDistribution
    .map((cls) => ({
      name:
        cls.name.split(" ")[0].charAt(0).toUpperCase() +
        cls.name.split(" ")[1].charAt(0).toUpperCase() +
        cls.name.split("-")[1].toUpperCase(),
      students: cls.studentCount,
    }))
    .filter((cls) => cls.students > 0);

  const genderData = [
    {
      name: "Males",
      value: data.counts.studentMales,
      fill: "var(--chart-2)",
      stroke: "var(--border)",
    },
    {
      name: "Females",
      value: data.counts.studentFemales,
      fill: "var(--chart-1)",
      stroke: "var(--primary)",
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

  const staffGender = [
    {
      name: "Male Staff",
      value: data.counts.staffMales,
      fill: "var(--destructive)",
    },
    {
      name: "Female Staff",
      value: data.counts.staffFemales,
      fill: "var(--muted-foreground)",
    },
  ];

  const staffDistributionPerDept = [
    {
      name: "Arts",
      value: data.counts.staffCount4GArt,
      fill: "var(--ring)",
    },
    {
      name: "Home",
      value: data.counts.staffCount4Home,
      fill: "var(--destructive)",
    },
    {
      name: "Tech",
      value: data.counts.staffCount4Tech,
      fill: "#FF7F50",
    },
    {
      name: "VArts",
      value: data.counts.staffCount4VArt,
      fill: "var(--muted-foreground)",
    },
    {
      name: "ICT",
      value: data.counts.staffCount4Ict,
      fill: "#DAA06D",
    },
    {
      name: "Math",
      value: data.counts.staffCount4Math,
      fill: "var(--chart-2)",
    },
    {
      name: "Lang",
      value: data.counts.staffCount4Lang,
      fill: "#FF5F1F",
    },
    {
      name: "Agric",
      value: data.counts.staffCount4Agric,
      fill: "#F88379",
    },
    {
      name: "Sci",
      value: data.counts.staffCount4Science,
      fill: "var(--chart-5)",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 ">
        <MetricCard
          title="Students"
          value={data.counts.students}
          description="Total enrolled"
          icon={<GraduationCap />}
          trend="up"
          className="border-b-4 sm:border-l-4 sm:border-b-0 border-primary"
        />
        <MetricCard
          title="Teachers"
          value={data.counts.teachers}
          description="Active staff"
          icon={<UserPen />}
          trend="stable"
          className="border-b-4 sm:border-l-4 sm:border-b-0 border-primary/80"
        />
        <MetricCard
          title="Departments"
          value={data.counts.departments}
          description="Academic units"
          icon={<Home />}
          trend="up"
          className="border-b-4 sm:border-l-4 sm:border-b-0 border-primary/60"
        />
        <MetricCard
          title="Classes"
          value={data.counts.classes}
          description="Active rooms"
          icon={<LucideBuilding2 />}
          trend="down"
          className="border-b-4 sm:border-l-4 sm:border-b-0 border-primary/40"
        />
        <MetricCard
          title="Courses"
          value={data.counts.courses}
          description="Catalog size"
          icon={<BookOpen />}
          trend="up"
          className="border-b-4 sm:border-l-4 sm:border-b-0 border-primary/20"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Department Distribution Chart */}
        <Card className="md:col-span-4 shadow-lg dark:bg-card ">
          <CardHeader>
            <CardTitle className="text-lg">Learning Area Enrollment</CardTitle>
            <CardDescription className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
              Breakdown of students per learning area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartOptions}>
              <BarChart
                data={departmentChartData}
                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="bg-muted-foreground"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar
                  dataKey="students"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                  shape={TriangleBar}>
                  {departmentChartData.map((_, i) => (
                    <LabelList
                      key={`cell-${i.toFixed(2)}`}
                      content={CustomColorLabel}
                    />
                  ))}
                </Bar>
                <ChartLegend />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Class Distribution Chart */}
        <Card className="md:col-span-3 shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Gender Balance</CardTitle>
            <CardDescription className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
              Current ratio of male to female students
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer
              config={chartOptions}
              className="mx-auto aspect-square min-h-62.5 max-w-75">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={genderData}
                  dataKey="value"
                  innerRadius="60%"
                  outerRadius="90%"
                  strokeWidth={1}
                  paddingAngle={5}>
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
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-3 shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Staff Distribution by Gender
            </CardTitle>
            <CardDescription className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
              Percentage of staff by gender
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer
              config={chartOptions}
              className="mx-auto aspect-square min-h-62.5 max-w-75">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={staffGender}
                  dataKey="value"
                  innerRadius="60%"
                  outerRadius="90%">
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
                              {data.counts.teachers.toString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground">
                              Staff
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
                <div className="flex items-center gap-2 bg-linear-to-b from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
                  Showing total gender distribution metrics.
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
        {/* Year Group Distribution */}

        <Card className="md:col-span-4 shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Year Group Gender Distribution
            </CardTitle>
            <CardDescription className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
              Student gender distribution by Year Groups.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <ChartContainer
              config={chartOptions}
              className="mx-auto aspect-video min-h-62.5 max-w-75 md:max-w-full">
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
                  stroke="var(--chart-5)"
                  strokeWidth={2}
                  dot={true}
                />
                <Line
                  dataKey="females"
                  type="monotone"
                  stroke="var(--chart-1)"
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
                <div className="flex items-center gap-2 bg-linear-to-b from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
                  Showing total gender metrics for all forms.
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Department Distribution Chart */}
        <Card className="md:col-span-4 shadow-lg dark:bg-card ">
          <CardHeader>
            <CardTitle className="text-lg">Class Enrollment</CardTitle>
            <CardDescription className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
              Breakdown of students per class grouping
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartOptions}>
              <BarChart
                data={classChartData}
                margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  className="bg-muted-foreground"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Bar
                  dataKey="students"
                  radius={[6, 6, 0, 0]}
                  barSize={40}
                  shape={TriangleBar}>
                  {departmentChartData.map((_, i) => (
                    <LabelList
                      key={`cell-${i.toFixed(2)}`}
                      content={CustomColorLabel}
                    />
                  ))}
                </Bar>
                <ChartLegend />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Class Distribution Chart */}
        <Card className="md:col-span-3 shadow-lg dark:bg-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Teaching Staff Distribution
            </CardTitle>
            <CardDescription className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
              Teaching staff distribution per each acadmic department
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <ChartContainer
              config={chartOptions}
              className="mx-auto aspect-square min-h-62.5 max-w-75">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={staffDistributionPerDept}
                  dataKey="value"
                  innerRadius="55%"
                  outerRadius="90%"
                  strokeWidth={1}>
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
                              y={viewBox.cy - 28}
                              className="fill-foreground text-3xl font-bold">
                              {data.counts.teachingStaffCount.toString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) - 8}
                              className="fill-muted-foreground">
                              Teaching Staff
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
                <ChartLegend
                  wrapperStyle={{
                    lineHeight: "20px",
                    bottom: "-5%",
                    left: "-20%",
                    right: "20%",
                  }}
                  width={350}
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Students */}
      <Card className="overflow-auto shadow-lg dark:bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <CardTitle className="text-lg">
              Recently Enrolled Students
            </CardTitle>
            <CardDescription className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
              Recently enrolled students in the system
            </CardDescription>
          </div>
          <Link href="/admin/students">
            <Button size="sm" variant="outline">
              <span className="bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent font-mono">
                View All
              </span>
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <BaseDataTable
            columns={columns}
            data={data.recentStudents}
            className="dark:bg-card"
          />
        </CardContent>
      </Card>
    </div>
  );
}
