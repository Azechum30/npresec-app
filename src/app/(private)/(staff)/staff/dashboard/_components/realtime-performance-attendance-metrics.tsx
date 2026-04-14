"use client";

import { Notification } from "@/components/customComponents/notification";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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

type Props = {
  performanceMetrics: {
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
};

export const RealtimePerformanceAndAttendanceMetrics = ({
  performanceMetrics,
}: Props) => {
  const uniqueYears = useMemo(() => {
    return Array.from(
      new Set(performanceMetrics.map((metric) => String(metric.academicYear))),
    )
      .sort()
      .reverse();
  }, [performanceMetrics]);

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0] || "");

  const availableSemesters = useMemo(() => {
    const semesters = performanceMetrics
      .filter((item) => String(item.academicYear) === selectedYear)
      .map((item) => item.semester);
    return Array.from(new Set(semesters)).sort();
  }, [performanceMetrics, selectedYear]);

  const [selectedSemester, setSelectedSemester] = useState(
    availableSemesters[0] || "",
  );

  useMemo(() => {
    if (!availableSemesters.includes(selectedSemester)) {
      setSelectedSemester(availableSemesters[0] || "");
    }
  }, [availableSemesters, selectedSemester]);

  const filteredData = performanceMetrics.filter(
    (metric) =>
      String(metric.academicYear) === selectedYear &&
      metric.semester === selectedSemester,
  );

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];
  const activeTypes = ALL_TYPES.filter((type) =>
    performanceMetrics.some(
      (course) => (course[type as keyof typeof course] as number) > 0,
    ),
  );

  return (
    <Card className="dark:bg-accent w-full">
      <CardHeader className="border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <CardTitle className="text-xl font-bold">
            Student Average Performance Metrics
          </CardTitle>
          <CardDescription className="text-sm">
            Track class averages by timeframe
          </CardDescription>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Year Filter */}
          <div className="flex items-center gap-2">
            <Label htmlFor="academicYear" className="text-sm font-medium">
              Year:
            </Label>
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
            <Label htmlFor="semester" className="text-sm font-medium">
              Semester:
            </Label>
            <Select
              value={selectedSemester}
              onValueChange={(val) => setSelectedSemester(val)}>
              <SelectTrigger id="academicYear">
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

      {/* The Chart */}
      <div
        className={cn(
          "w-full h-100 p-3",
          filteredData.length === 1 && "h-auto",
        )}>
        {filteredData.length === 1 ? (
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-3 border md:border-none rounded-md md:rounded-none">
            <div className="flex md:flex-col justify-between gap-1.5 item-center">
              <div>
                <h2 className="text-xl font-bold mb-1">
                  {filteredData[0].courseName.split("-")[0]}
                </h2>
                <p className="text-sm mb-4">
                  {filteredData[0].className} | {filteredData[0].semester} (
                  {filteredData[0].academicYear})
                </p>
              </div>

              <div className="mb-6">
                <span className="text-sm font-medium">Cumulative Average</span>
                <div className="text-4xl md:text-5xl font-extrabold text-primary">
                  {filteredData[0].total}%
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
                    {filteredData[0][type as keyof (typeof filteredData)[0]]}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filteredData.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} maxBarSize={40}>
              <XAxis
                dataKey="courseName"
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 100]} />
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
