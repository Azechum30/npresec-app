"use client";

import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type Props = {
  data: {
    courseName: string;
    className: string;
    academicYear: number;
    semester: string;
    total: number; // The pre-calculated student max score
  }[];
};

export const BarchartComponent = ({ data }: Props) => {
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(data.map((item) => String(item.academicYear))))
      .sort()
      .reverse();
  }, [data]);

  const [selectedYear, setSelectedYear] = useState(uniqueYears[0] || "");

  const availableSemesters = useMemo(() => {
    return Array.from(
      new Set(
        data
          .filter((item) => String(item.academicYear) === selectedYear)
          .map((item) => item.semester),
      ),
    ).sort();
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
    (item) =>
      String(item.academicYear) === selectedYear &&
      item.semester === selectedSemester,
  );

  return (
    <Card className="dark:bg-accent">
      <CardHeader className="border-b flex justify-between items-center mb-6">
        <div>
          <CardTitle className="font-bold text-lg">Top Performance</CardTitle>
          <CardDescription>Track top performing students.</CardDescription>
        </div>

        <div className="flex gap-4">
          <Select
            value={selectedYear}
            onValueChange={(val) => setSelectedYear(val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {uniqueYears.map((yr) => (
                <SelectItem key={yr} value={yr}>
                  {yr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedSemester}
            onValueChange={(val) => setSelectedSemester(val)}>
            <SelectTrigger>
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
      </CardHeader>

      {filteredData.length === 1 ? (
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {filteredData[0].courseName.split("-")[0].trim()}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {filteredData[0].className} | {filteredData[0].semester} (
              {filteredData[0].academicYear})
            </p>

            <p className="text-sm text-gray-600 dark:text-gray-300">
              This breakdown represents the exact peak contribution towards a
              full 100% final grade score executed by the highest-performing
              student in this classroom.
            </p>
          </div>

          <div className="bg-secondary p-8 rounded-xl border flex flex-col items-center justify-center text-center">
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Highest Student Score
            </span>
            <div className="text-6xl font-extrabold text-primary mt-2">
              {filteredData[0].total}%
            </div>
          </div>
        </div>
      ) : (
        <div className={cn("h-87.5 w-full")}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredData} maxBarSize={30}>
              <XAxis
                dataKey="courseName"
                angle={-25}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />

              <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]}>
                <LabelList
                  dataKey="total"
                  position="top"
                  offset={10}
                  formatter={(v: any) => `${v}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
};
