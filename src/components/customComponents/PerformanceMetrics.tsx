"use client";

import { Notification } from "@/components/customComponents/notification";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ALL_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// 1. Define the base structure that any metric object must have
export type BaseMetric = {
  courseName: string;
  className: string;
  academicYear: number;
  semester: string;
  total: number;
};

// 2. Define the props using a generic <T> that extends our BaseMetric
type Props<T extends BaseMetric> = {
  data: T[];
  title?: string;
  description?: string;
  unitLabel?: string; // e.g., "%", "pts", "hrs"
  kpiLabel?: string; // e.g., "Cumulative Average", "Highest Peak Score"
  yAxisDomain?: [number, number]; // Defaults to [0, 100]
};

export const RealtimeMetricsDashboard = <T extends BaseMetric>({
  data,
  title = "Student Performance Metrics",
  description = "Track class metrics by timeframe",
  unitLabel = "%",
  kpiLabel = "Cumulative Total",
  yAxisDomain = [0, 100],
}: Props<T>) => {
  const uniqueYears = useMemo(() => {
    return Array.from(
      new Set(data.map((metric) => String(metric.academicYear))),
    )
      .sort()
      .reverse();
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0] || "");

  const availableSemesters = useMemo(() => {
    const semesters = data
      .filter((item) => String(item.academicYear) === selectedYear)
      .map((item) => item.semester);
    return Array.from(new Set(semesters)).sort();
  }, [data, selectedYear]);

  const [selectedSemester, setSelectedSemester] = useState(
    availableSemesters[0] || "",
  );

  useMemo(() => {
    if (!availableSemesters.includes(selectedSemester)) {
      setSelectedSemester(availableSemesters[0] || "");
    }
  }, [availableSemesters, selectedSemester]);

  const filteredData = data.filter(
    (metric) =>
      String(metric.academicYear) === selectedYear &&
      metric.semester === selectedSemester,
  );

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  const activeTypes = ALL_TYPES.filter((type) =>
    data.some((course) => (course[type as keyof T] as unknown as number) > 0),
  );

  return (
    <Card className="dark:bg-accent">
      <CardHeader className="border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <CardTitle className="text-lg font-bold">{title}</CardTitle>
          <CardDescription className="text-sm">{description}</CardDescription>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <Select
              value={String(selectedYear)}
              onValueChange={(val) => setSelectedYear(val)}>
              <SelectTrigger id="academicYear">
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent align="center" position="popper">
                {uniqueYears.map((yr) => (
                  <SelectItem key={String(yr)} value={String(yr)}>
                    {String(yr)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Semester Filter */}
          <div className="flex items-center gap-2">
            <Select
              value={selectedSemester}
              onValueChange={(val) => setSelectedSemester(val)}>
              <SelectTrigger id="semester">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent align="center" position="popper">
                {availableSemesters.map((sem) => (
                  <SelectItem key={sem} value={sem}>
                    {sem}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      {/* The Chart / KPI Card */}
      <div
        className={cn(
          "w-full h-87.5 p-3",
          filteredData.length === 1 && "h-auto",
        )}>
        {filteredData.length === 1 ? (
          <div className="p-4 border md:border-none rounded-md md:rounded-none">
            <div className="flex justify-between gap-1.5 items-center ">
              <div>
                <h2 className="text-xl font-bold mb-1">
                  {filteredData[0].courseName.split("-")[0].trim()}
                </h2>
                <p className="text-sm mb-4">
                  {filteredData[0].className} | {filteredData[0].semester} (
                  {filteredData[0].academicYear})
                </p>
              </div>

              <div className="mb-6">
                <span className="text-sm font-medium">{kpiLabel}</span>
                <div className="text-4xl md:text-5xl font-extrabold text-primary">
                  {filteredData[0].total}
                  {unitLabel}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:col-span-2">
              {activeTypes.map((type) => (
                <div key={type} className="p-3 bg-secondary rounded-lg border">
                  <span className="text-xs font-medium text-primary uppercase">
                    {type}
                  </span>
                  <div className="text-lg font-bold">
                    {String(filteredData[0][type as keyof T])}
                    {unitLabel}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} maxBarSize={30}>
              <XAxis
                dataKey="courseName"
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={yAxisDomain} />
              <Tooltip />
              <Legend />

              {activeTypes.map((type, index) => {
                const isLastBar = index === activeTypes.length - 1;
                return (
                  <Bar
                    key={type}
                    dataKey={type}
                    stackId="a"
                    fill={COLORS[index % COLORS.length]}>
                    {isLastBar && (
                      <LabelList
                        dataKey="total"
                        position="top"
                        offset={10}
                        style={{
                          fontWeight: "600",
                          fill: "var(--card-foreground)",
                          fontSize: "12px",
                        }}
                      />
                    )}
                  </Bar>
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Notification description="No data recorded for the selected timeframe." />
        )}
      </div>
    </Card>
  );
};
