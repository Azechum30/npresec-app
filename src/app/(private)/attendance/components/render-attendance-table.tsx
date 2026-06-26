/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useGetAttendanceColumns } from "@/app/(private)/attendance/hooks/use-get-attendance-columns";
import { attendanceTransformer } from "@/app/(private)/attendance/utils/attendance-transformer";
import DataTable from "@/components/customComponents/data-table";
import DatePicker from "@/components/customComponents/DatePicker";
import { useAuth } from "@/components/customComponents/SessionProvider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { attendanceStatus } from "@/lib/validation";
import { useSuspenseQueries } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { classQueryOptions } from "../../(admin)/admin/classes/actions/queries";
import { useBulkDeleteAttendanceMutationFn } from "../actions/mutations";
import { attendanceQueryOptions } from "../actions/queries";

export const RenderAttendanceTable = () => {
  const columns = useGetAttendanceColumns();
  const [classId, setClassId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<string>("");

  const [classQueryData, attendanceQueryData] = useSuspenseQueries({
    queries: [classQueryOptions, attendanceQueryOptions(classId)],
  });

  const { mutateAsync } = useBulkDeleteAttendanceMutationFn();
  const user = useAuth();

  const classes = useMemo(() => {
    if (!classQueryData.data) return [];
    if (user?.roles?.some((role) => role.role?.name === "classTeacher"))
      return classQueryData.data
        .filter((cls) => cls.classTeacher?.userId === user.id)
        .map((cls) => ({
          id: cls.id,
          name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
        }));
    return classQueryData.data.map((cls) => ({
      id: cls.id,
      name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
    }));
  }, [classQueryData.data, user]);

  const attendance = useMemo(() => {
    if (!classId || !attendanceQueryData.data) return [];
    return (
      attendanceQueryData.data.attendance.filter((attendance) => {
        if (classId && attendance.classId !== classId) return false;

        if (status && attendance.status.toString() !== status.trim())
          return false;

        const attendanceDate = attendance.date;

        if (startDate && attendanceDate < startDate) return false;
        return !(endDate && attendanceDate > endDate);
      }) ?? []
    );
  }, [classId, attendanceQueryData.data, status, startDate, endDate]);

  return (
    <>
      <Card className="px-4 shadow-2xl flex flex-col md:flex-row md:justify-between md:items-center space-y-3 lg:space-y-0 mt-4 md:flex-wrap">
        <div className="flex flex-col md:flex-row gap-4 md:flex-1 lg:flex-initial">
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger
              className="w-full md:max-w-xs"
              type="button"
              role="combobox"
              aria-label="Filter-class-button">
              <SelectValue placeholder="Filter By Class" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {classes.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger
              className="w-full md:max-w-xs"
              type="button"
              role="combobox"
              aria-label="filter-status-button">
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent align="center" position="popper">
              {attendanceStatus.map((status) => (
                <SelectItem key={status} value={status.toString()}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <DatePicker
            id={"startData"}
            date={startDate as Date}
            setDate={setStartDate}
            placeholder={"Start Date"}
            className="w-auto md:max-w-xs"
            startYear={new Date().getFullYear() - 2}
            endYear={new Date().getFullYear()}
          />
          <DatePicker
            id={"endDate"}
            date={endDate as Date}
            setDate={setEndDate}
            placeholder={"End Date"}
            className="w-auto md:max-w-xs"
            startYear={new Date().getFullYear() - 2}
            endYear={new Date().getFullYear()}
          />
          <Button
            variant="outline"
            className="w-full md:w-auto border-orange-400"
            onClick={() => {
              setClassId("");
              setStartDate(undefined);
              setEndDate(undefined);
              setStatus("");
            }}>
            <X className="size-5" />
            Clear Filters
          </Button>
        </div>
      </Card>
      <DataTable
        columns={columns}
        data={attendance}
        transformer={attendanceTransformer}
        exportKey="attendance"
        filename={
          classId
            ? `Attendance for ${attendance.filter((value) => value.id === classId)[0]?.class.name}`
            : "Attendance"
        }
        onDelete={async (rows) => {
          const selectedRows = rows.map((row) => row.original.id);
          await Promise.try(async () => await mutateAsync(selectedRows));
        }}
      />
    </>
  );
};
