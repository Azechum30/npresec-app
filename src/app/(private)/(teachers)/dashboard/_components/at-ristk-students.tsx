"use client";

import BaseTable from "@/app/(private)/(admin)/admin/departments/components/BaseTable";
import { Notification } from "@/components/customComponents/notification";
import {
  Card,
  CardContent,
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
import { startTransition, useEffect, useMemo, useState } from "react";
import { useGetAtRiskStudentsColumns } from "../_hooks/use-get-at-risk-students-columns";

type Props = {
  data?: {
    studentId: string;
    firstName: string;
    lastName: string;
    middleName: string;
    gender: string;
    courseId: string;
    courseName: string;
    className: string;
    semester: string;
    academicYear: number;
    totalScore: number;
  }[];
};

export const AtRiskStudents = ({ data }: Props) => {
  const columns = useGetAtRiskStudentsColumns();
  const uniqueYears = useMemo(() => {
    return Array.from(new Set(data?.map((data) => String(data.academicYear))))
      .sort()
      .reverse();
  }, [data]);

  const [selectYear, setSelectedYear] = useState(uniqueYears[0] || "");

  const availableSemesters = useMemo(() => {
    const semesters = data
      ?.filter((item) => String(item.academicYear) === selectYear)
      .map((item) => item.semester);

    return Array.from(new Set(semesters?.map((sem) => sem))).sort();
  }, [data, selectYear]);

  const [selectedSemester, setSelectedSemester] = useState(
    availableSemesters[0] || "",
  );

  useEffect(() => {
    startTransition(() => {
      if (!availableSemesters.includes(selectedSemester)) {
        setSelectedSemester(availableSemesters[0]);
      }
    });
  }, [availableSemesters, selectedSemester]);

  const filterStudents = data?.filter(
    (student) =>
      String(student.academicYear) === String(selectYear) &&
      student.semester === selectedSemester,
  );

  return (
    <>
      <Card className="dark:bg-accent">
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg font-bold text-destructive">
              Low Performing Students
            </CardTitle>
            <CardDescription>
              The underlisted students are trailing and needs support
            </CardDescription>
          </div>
          <div className="flex gap-3">
            <Select
              value={String(selectYear)}
              onValueChange={(val) => setSelectedYear(val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent align="center" position="popper">
                {uniqueYears.map((year) => (
                  <SelectItem key={String(year)} value={String(year)}>
                    {String(year)}
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
        <CardContent>
          {filterStudents && filterStudents.length > 0 ? (
            <div className="border rounded-md">
              <BaseTable columns={columns} data={filterStudents} />
            </div>
          ) : (
            <Notification description="No students are at risk" />
          )}
        </CardContent>
      </Card>
    </>
  );
};
