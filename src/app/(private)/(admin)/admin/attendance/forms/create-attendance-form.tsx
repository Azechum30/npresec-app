import React, { cache, useEffect, useState } from "react";
import {
  AttendanceType,
  BulkAttendanceSchema,
  BulkAttendanceType,
} from "@/lib/validation";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { ClassesResponseType, StudentResponseType } from "@/lib/types";
import { getClassesAction } from "@/app/(private)/(admin)/admin/classes/actions/server-actions";
import { getStudents } from "@/app/(private)/(admin)/admin/students/actions/action";
import { toast } from "sonner";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, FileSymlink, PlusCircle, X } from "lucide-react";
import LoadingButton from "@/components/customComponents/LoadingButton";
import LoadingState from "@/components/customComponents/Loading";

type CreateAttendanceFormProps = {
  onSubmit: (data: BulkAttendanceType) => Promise<void>;
  defaultValues?: BulkAttendanceType;
  id?: string;
  isPending?: boolean;
};

export const CreateAttendanceForm: React.FC<CreateAttendanceFormProps> = ({
  onSubmit,
  defaultValues,
  id,
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
          studentEntries: [
            {
              studentId: "",
              status: "Present" as AttendanceType["status"],
            },
          ],
        },
  });

  const selectClassId = useWatch({
    control: form.control,
    name: "classId",
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "studentEntries",
  });

  const [classes, setClasses] = useState<
    Pick<ClassesResponseType, "id" | "name">[]
  >([]);
  const [students, setStudents] = useState<
    Pick<
      StudentResponseType,
      "id" | "firstName" | "lastName" | "studentNumber" | "classId"
    >[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [classesPromise, studentsPromise] = await Promise.all([
          getClassesAction(),
          getStudents(),
        ]);

        if (classesPromise.error) {
          toast.error(classesPromise.error);
          setIsLoading(false);
          return;
        }
        if (studentsPromise.error) {
          toast.error(studentsPromise.error);
          setIsLoading(false);
          return;
        }
        if (classesPromise.data) {
          setClasses(classesPromise.data);
        }

        if (studentsPromise.students) {
          setStudents(studentsPromise.students);
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectClassId) return;
    const classStudents = students.filter(
      (student) => student.classId === selectClassId
    );
    const updateStudents = classStudents.map((student) => ({
      studentId: student.id,
      status: "Present" as AttendanceType["status"],
    }));

    replace(updateStudents);
  }, [selectClassId, replace, students]);

  async function handleSubmit(values: BulkAttendanceType) {
    try {
      console.log(values);
      await onSubmit(values);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  function markAllAs(status: AttendanceType["status"]) {
    const updateStudents = fields.map((field) => ({
      studentId: field.studentId,
      status,
    }));
    replace(updateStudents);
  }

  const filterStudents = students.filter(
    (student) => student.classId === selectClassId
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "space-y-10 w-full text-left rounded-md border p-4",
          selectClassId && "h-full overflow-auto scrollbar-thin"
        )}>
        <div className={"flex flex-col md:flex-row gap-4 w-full"}>
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

        {selectClassId && filterStudents.length > 0 && (
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
            <div className="border rounded-md w-full h-full overflow-auto scrollbar-thin">
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-50 dark:bg-orange-900/20">
                    <TableHead className="text-orange-800 dark:text-orange-200">
                      Student ID
                    </TableHead>
                    <TableHead className="text-orange-800 dark:text-orange-200">
                      First Name
                    </TableHead>
                    <TableHead className="text-orange-800 dark:text-orange-200">
                      Last Name
                    </TableHead>
                    <TableHead className="text-orange-800 dark:text-orange-200">
                      Attendance Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.map((field, index) => {
                    const student = filterStudents.find(
                      (s) => s.id === field.studentId
                    );
                    return (
                      <TableRow key={field.id}>
                        <TableCell>{student?.studentNumber}</TableCell>
                        <TableCell>{student?.firstName}</TableCell>
                        <TableCell>{student?.lastName}</TableCell>
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
                                        "text-blue-500"
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
        )}

        {selectClassId && filterStudents.length > 0 && (
          <LoadingButton loading={isPending as boolean}>
            <PlusCircle className="size-5" />
            {isPending ? "Saving Attendance" : "Record Attendance"}
          </LoadingButton>
        )}

        {isLoading && <LoadingState />}
      </form>
    </Form>
  );
};
