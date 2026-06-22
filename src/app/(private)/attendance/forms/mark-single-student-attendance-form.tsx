/**biome-ignore-all assist/source/organizeImports: reason */
"use client";
import { Form } from "@/components/ui/form";
import {
  type SingleStudentAttendance,
  SingleStudentAttendanceSchema,
  attendanceStatus,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { useAuth } from "@/components/customComponents/SessionProvider";
import { useQueries } from "@tanstack/react-query";
import { PlusCircleIcon } from "lucide-react";
import { classQueryOptions } from "../../(admin)/admin/classes/actions/queries";
import { studentsQueryOptions } from "../../(admin)/admin/students/actions/queries";

type MarkSingleStudentAttendanceFormProps = {
  onSubmitAction: (data: SingleStudentAttendance) => Promise<void>;
  defaultValues?: SingleStudentAttendance;
  id?: string;
  isPending?: boolean;
};

export const MarkSingleStudentAttendanceForm = ({
  isPending,
  id,
  defaultValues,
  onSubmitAction,
}: MarkSingleStudentAttendanceFormProps) => {
  const form = useForm<SingleStudentAttendance>({
    resolver: zodResolver(SingleStudentAttendanceSchema),
    defaultValues: defaultValues ?? {
      status: "Present",
      studentId: "",
      classId: "",
      semester: "",
      date: new Date(),
    },
  });

  const classId = useWatch({
    control: form.control,
    name: "classId",
  });
  const date = useWatch({
    control: form.control,
    name: "date",
  });
  const semester = useWatch({
    control: form.control,
    name: "semester",
  });
  const user = useAuth();
  const [classQueryData, studentsQueryData] = useQueries({
    queries: [classQueryOptions, studentsQueryOptions],
  });

  const classes = useMemo(() => {
    if (!classQueryData.data || !user) return [];

    if (user.roles?.map((role) => role.role?.name === "classTeacher"))
      return classQueryData.data
        .filter((cls) => cls.classTeacher?.userId === user.id)
        .map((cls) => ({
          id: {
            id: cls.id,
            name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
          },
        }));

    return classQueryData.data.map((cls) => ({
      id: cls.id,
      name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
    }));
  }, [classQueryData.data, user]);

  const students = useMemo(() => {
    if (!classId || !studentsQueryData.data) return [];

    return (
      studentsQueryData.data
        .filter((stu) => {
          if (defaultValues) return stu.id === defaultValues.studentId;
          const targetDateStr = new Date(date).toISOString().split("T")[0];
          const alreadyHasRecordForThisSemester = stu.attendance?.some(
            (at) =>
              at.semester === semester &&
              new Date(at.date).toISOString().split("T")[0] === targetDateStr,
          );
          return stu.classId === classId && !alreadyHasRecordForThisSemester;
        })
        .map((stu) => ({
          id: stu.id,
          fullName: `${stu.lastName} ${stu.firstName}`,
        })) ?? []
    );
  }, [studentsQueryData.data, classId, date, defaultValues, semester]);

  async function handleSubmit(values: SingleStudentAttendance) {
    await onSubmitAction(values);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 text-left border rounded-md p-4">
        <SelectWithLabel
          name="classId"
          fieldTitle="Class"
          data={classes}
          valueKey="id"
          selectedKey="name"
          placeholder="--Select Class--"
          disabled={!!defaultValues}
        />

        <DatePickerWithLabel
          name="date"
          fieldTitle="Date"
          restrictToCurrentDay={true}
          disable={!!id}
        />

        <SelectWithLabel
          name="semester"
          fieldTitle="Semester"
          data={["First", "Second"].map((sem) => ({ id: sem, name: sem }))}
          valueKey="id"
          selectedKey="name"
          placeholder="--Select Semester--"
          disabled={!!defaultValues}
        />

        <SelectWithLabel
          name="studentId"
          fieldTitle="Student"
          data={students}
          valueKey="id"
          selectedKey="fullName"
          placeholder="--Select Student--"
          disabled={!classId || !!defaultValues}
        />

        <SelectWithLabel
          name="status"
          fieldTitle="Status"
          data={attendanceStatus.map((status) => status)}
          placeholder="--Select Attendance Status--"
        />

        <LoadingButton loading={isPending as boolean}>
          {id ? (
            isPending ? (
              "Saving"
            ) : (
              <>
                <PlusCircleIcon className="size-5" />
                <span>Save Attendance</span>
              </>
            )
          ) : isPending ? (
            "Recording"
          ) : (
            <>
              <PlusCircleIcon className="size-5" />
              <span>Record Attendance</span>
            </>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
