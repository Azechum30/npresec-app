"use client";
import { useForm, useWatch } from "react-hook-form";
import {
  SingleStudentAttendance,
  SingleStudentAttendanceSchema,
  attendanceStatus,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { getClassesAction } from "@/app/(private)/(admin)/admin/classes/actions/server-actions";
import { toast } from "sonner";

import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import { getStudents } from "@/app/(private)/(admin)/admin/students/actions/action";
import { StudentResponseType, ClassesResponseType } from "@/lib/types";
import LoadingButton from "@/components/customComponents/LoadingButton";

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
    defaultValues: defaultValues || {
      status: "Present",
      studentId: "",
      classId: "",
      semester: "",
      date: new Date(),
    },
  });

  const [allStudents, setAllStudents] = useState<
    Pick<StudentResponseType, "id" | "firstName" | "lastName" | "classId">[]
  >([]);
  const [classes, setClasses] = useState<
    Pick<ClassesResponseType, "id" | "name">[]
  >([]);
  const [filteredStudents, setFilteredStudents] = useState<
    { id: string; fullName: string }[]
  >([]);

  const classId = useWatch({
    control: form.control,
    name: "classId",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesPromise, studentsPromise] = await Promise.all([
          getClassesAction(),
          getStudents(),
        ]);

        if (classesPromise.error || studentsPromise.error) {
          toast.error(classesPromise.error || studentsPromise.error);
          return;
        }

        if (classesPromise.data) {
          setClasses(
            id
              ? classesPromise.data.filter(
                  (cls) => cls.id === defaultValues?.classId
                )
              : classesPromise.data
          );
        }

        if (studentsPromise.students) {
          const students = id
            ? studentsPromise.students.filter(
                (student) => student.id === defaultValues?.studentId
              )
            : studentsPromise.students;

          setAllStudents(students);

          // For edit mode, set the filteredStudents directly
          if (id && defaultValues?.studentId) {
            const student = studentsPromise.students.find(
              (s) => s.id === defaultValues.studentId
            );
            if (student) {
              setFilteredStudents([
                {
                  id: student.id,
                  fullName: `${student.firstName} ${student.lastName}`,
                },
              ]);
            }
            return;
          }

          // For create mode
          setFilteredStudents(
            students
              .filter((student) => !classId || student.classId === classId)
              .map((student) => ({
                id: student.id,
                fullName: `${student.firstName} ${student.lastName}`,
              }))
          );
        }
      } catch (error) {
        toast.error("Failed to load data");
      }
    };
    fetchData();
  }, [id, defaultValues?.classId, defaultValues?.studentId]);

  useEffect(() => {
    if (!id && classId) {
      const updatedStudents = allStudents
        .filter((student) => student.classId === classId)
        .map((student) => ({
          id: student.id,
          fullName: `${student.firstName} ${student.lastName}`,
        }));
      setFilteredStudents(updatedStudents);
      form.setValue("studentId", "");
    } else {
      // Show all students when no class is selected
      setFilteredStudents(
        allStudents.map((student) => ({
          id: student.id,
          fullName: `${student.firstName} ${student.lastName}`,
        }))
      );
    }
  }, [classId, allStudents, form, id]);

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
          data={id ? [defaultValues?.semester] : ["First", "Second"]}
          placeholder="--Select Semester--"
        />

        <SelectWithLabel
          name="studentId"
          fieldTitle="Student"
          data={filteredStudents}
          valueKey="id"
          selectedKey="fullName"
          placeholder="--Select Student--"
          disabled={!classId}
        />

        <SelectWithLabel
          name="status"
          fieldTitle="Status"
          data={attendanceStatus.map((status) => status)}
          placeholder="--Select Attendance Status--"
        />

        <LoadingButton loading={isPending as boolean}>
          {id ? (
            <>{isPending ? "Updating Attendance ..." : "Update Attendance"}</>
          ) : (
            <>{isPending ? "Saving Attendance" : "Record Attendance"}</>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
