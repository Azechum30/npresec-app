"use client";

import { AttendanceResponseType, ClassesResponseType } from "@/lib/types";
import { useMemo, useState } from "react";
import DataTable from "@/components/customComponents/data-table";
import { useGetAttendanceColumns } from "@/app/(private)/(admin)/admin/attendance/hooks/use-get-attendance-columns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "@/components/customComponents/DatePicker";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { attendanceStatus } from "@/lib/validation";
import { attendanceTransformer } from "@/app/(private)/(admin)/admin/attendance/utils/attendance-transformer";
import { useMultipleDeleteAttendance } from "@/app/(private)/(admin)/admin/attendance/hooks/use-multiple-delete-attendance";

type RenderAttendanceTableProps = {
  promise: {
    attendance: AttendanceResponseType[];
    data: ClassesResponseType[];
  };
};

export const RenderAttendanceTable = ({
  promise,
}: RenderAttendanceTableProps) => {
  const columns = useGetAttendanceColumns();
  const [classId, setClassId] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [status, setStatus] = useState<string>("");

  const filterAttendance = useMemo(() => {
    const initialData = promise.attendance;

    return initialData.filter((attendance) => {
      if (classId && attendance.classId !== classId) return false;

      if (status && attendance.status.toString() !== status.trim())
        return false;

      const attendanceDate = attendance.date;

      if (startDate && attendanceDate < startDate) return false;
      return !(endDate && attendanceDate > endDate);
    });
  }, [promise.attendance, classId, startDate, endDate, status]);

  const { isPending, handleMultipleDeleteAttendance } =
    useMultipleDeleteAttendance();

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-3 lg:space-y-0 mt-4 md:flex-wrap">
        <div className="flex flex-col md:flex-row gap-4 md:flex-1 lg:flex-initial">
          <Select value={classId} onValueChange={setClassId}>
            <SelectTrigger className="w-full md:max-w-xs">
              <SelectValue placeholder="Filter By Class" />
            </SelectTrigger>
            <SelectContent>
              {promise.data.map((classItem) => (
                <SelectItem key={classItem.id} value={classItem.id}>
                  {classItem.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:max-w-xs">
              <SelectValue placeholder="Filter By Status" />
            </SelectTrigger>
            <SelectContent>
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
            className="border-orange-400"
            onClick={() => {
              setClassId("");
              setStartDate(undefined);
              setEndDate(undefined);
              setStatus("");
            }}
          >
            <X className="size-5" />
            Clear Filters
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={filterAttendance}
        transformer={attendanceTransformer}
        filename={
          classId
            ? `Attendance for ${promise.data.filter((value) => value.id === classId)[0].name}`
            : "Attendance"
        }
        onDelete={async (rows) => {
          const selectedRows = rows.map((row) => row.original.id);
          await handleMultipleDeleteAttendance(selectedRows);
        }}
      />
    </>
  );
};
