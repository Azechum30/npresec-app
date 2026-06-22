/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { AvatarComponent } from "@/components/customComponents/avatar-component";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Notification } from "@/components/customComponents/notification";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { useAuth } from "@/components/customComponents/SessionProvider";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  type AttendanceType,
  BulkAttendanceSchema,
  type BulkAttendanceType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { CheckCircle, Clock, FileSymlink, PlusCircle, X } from "lucide-react";
import { type FC, useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { classQueryOptions } from "../../(admin)/admin/classes/actions/queries";
import { studentsQueryOptions } from "../../(admin)/admin/students/actions/queries";

type CreateAttendanceFormProps = {
  onSubmit: (data: BulkAttendanceType) => Promise<void>;
  defaultValues?: BulkAttendanceType;
  isPending?: boolean;
};

export const CreateAttendanceForm: FC<CreateAttendanceFormProps> = ({
  onSubmit,
  defaultValues,
  isPending,
}) => {
  const form = useForm<BulkAttendanceType>({
    resolver: zodResolver(BulkAttendanceSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          date: new Date(),
          classId: "",
          semester: "",
          studentEntries: [],
        },
  });

  const selectClassId = useWatch({
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

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "studentEntries",
  });

  const user = useAuth();

  const [classQueryData, studentsQueryData] = useQueries({
    queries: [classQueryOptions, studentsQueryOptions],
  });

  const classes = useMemo(() => {
    if (!classQueryData.data) return [];

    if (user?.roles?.some((r) => r.role?.name === "classTeacher"))
      return classQueryData.data
        .filter((cl) => cl.classTeacher?.userId === user?.id)
        .map((cls) => ({
          id: cls.id,
          name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
        }));

    return classQueryData.data.map((cls) => ({
      id: cls.id,
      name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
    }));
  }, [classQueryData.data, user]);

  const students = useMemo(() => {
    if (!selectClassId || !studentsQueryData.data) return [];

    return (
      studentsQueryData.data
        .filter((stu) => {
          const hasAttendanceToday = stu.attendance?.some((at) => {
            return (
              at.date.toISOString().split("T")[0] ===
                date.toISOString().split("T")[0] &&
              String(semester) === String(at?.semester)
            );
          });
          return selectClassId === String(stu.classId) && !hasAttendanceToday;
        })
        .map((stu) => ({
          id: stu.id,
          lastName: stu.lastName,
          firstName: stu.firstName,
          studentNumber: stu.studentNumber,
          gender: stu.gender,
          image: stu.user?.image,
          classId: stu.classId,
        })) ?? []
    );
  }, [studentsQueryData.data, selectClassId, semester, date]);

  const studentMap = useMemo(
    () => new Map(students.map((s) => [s.id, s])),
    [students],
  );

  useEffect(() => {
    if (!selectClassId) return;
    const classStudents = students.filter(
      (student) => student.classId === selectClassId,
    );
    const updateStudents = classStudents.map((student) => ({
      studentId: student.id,
      status: "Present" as AttendanceType["status"],
    }));

    replace(updateStudents);
  }, [selectClassId, replace, students]);

  async function handleSubmit(values: BulkAttendanceType) {
    await Promise.try(async () => {
      await onSubmit(values);
    });
  }

  function markAllAs(status: AttendanceType["status"]) {
    const updateStudents = fields.map((field) => ({
      studentId: field.studentId,
      status,
    }));
    replace(updateStudents);
  }

  const isLoading = classQueryData.isLoading || studentsQueryData.isLoading;

  if (isLoading) return <ShowLoadingState />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "space-y-6 w-full text-left rounded-md border p-4 max-h-[75vh] overflow-auto scrollbar-thin",
        )}>
        <div className={"flex flex-col md:flex-row gap-2 w-full"}>
          <div className="flex-1">
            <SelectWithLabel
              name="classId"
              fieldTitle="Class"
              data={classes}
              valueKey="id"
              selectedKey="name"
              schema={BulkAttendanceSchema}
              placeholder="--Select class--"
            />
          </div>
          <div className="flex-1">
            <DatePickerWithLabel
              name="date"
              fieldTitle="Date"
              schema={BulkAttendanceSchema}
              startDate={new Date().getFullYear()}
              endDate={new Date().getFullYear()}
              restrictToCurrentDay={true}
            />
          </div>
          <div className="flex-1">
            <SelectWithLabel
              name="semester"
              fieldTitle="Semester"
              data={["First", "Second"]}
              placeholder="--Select semester--"
              schema={BulkAttendanceSchema}
            />
          </div>
        </div>

        {selectClassId && students.length > 0 ? (
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-green-500 text-green-500"
                onClick={() => markAllAs("Present")}>
                <CheckCircle className="size-5" />
                Mark All Present
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-red-500 text-red-500"
                onClick={() => markAllAs("Absent")}>
                <X className="size-5" />
                Mark All Absent
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-orange-500 text-orange-500"
                onClick={() => markAllAs("Late")}>
                <Clock className="size-5" />
                Mark All Late
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-blue-500 text-blue-500"
                onClick={() => markAllAs("Excused")}>
                <FileSymlink className="size-5" />
                Mark All Excused
              </Button>
            </div>
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Avatar</TableHead>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Last Name</TableHead>
                    <TableHead>First Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const student = studentMap.get(field.studentId);
                    return (
                      <TableRow key={field.id}>
                        <TableCell>
                          <AvatarComponent
                            image={student?.image ?? undefined}
                            fallback={`${student?.lastName} ${student?.firstName}`}
                          />
                        </TableCell>
                        <TableCell>{student?.studentNumber}</TableCell>
                        <TableCell>{student?.lastName}</TableCell>
                        <TableCell>{student?.firstName}</TableCell>
                        <TableCell>{student?.gender}</TableCell>

                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`studentEntries.${index}.status`}
                            render={({ field }) => (
                              <FormItem>
                                <Select
                                  defaultValue={field.value}
                                  onValueChange={field.onChange}>
                                  <SelectTrigger
                                    className={cn(
                                      field.value === "Present" &&
                                        "text-green-500",
                                      field.value === "Absent" &&
                                        "text-red-500",
                                      field.value === "Late" &&
                                        "text-orange-500",
                                      field.value === "Excused" &&
                                        "text-blue-500",
                                    )}>
                                    <SelectValue placeholder="Present" />
                                  </SelectTrigger>
                                  <FormControl>
                                    <SelectContent position="popper">
                                      <SelectItem
                                        value="Present"
                                        className="text-green-500">
                                        Present
                                      </SelectItem>
                                      <SelectItem
                                        value="Absent"
                                        className="text-red-500">
                                        Absent
                                      </SelectItem>
                                      <SelectItem
                                        value="Late"
                                        className="text-orange-500">
                                        Late
                                      </SelectItem>
                                      <SelectItem
                                        value="Excused"
                                        className="text-blue-500">
                                        Excused
                                      </SelectItem>
                                    </SelectContent>
                                  </FormControl>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <Notification description="All students for the selected class, date and semester have attendance recorded already" />
        )}

        {selectClassId && students.length > 0 && (
          <LoadingButton
            loading={isPending as boolean}
            className="w-full sm:w-[25%] sm:mx-auto">
            <PlusCircle className="size-5" />
            {isPending ? "Saving Attendance" : "Save Records"}
          </LoadingButton>
        )}
      </form>
    </Form>
  );
};
