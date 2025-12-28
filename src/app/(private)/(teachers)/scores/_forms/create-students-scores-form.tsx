import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  AssesessmentSchema,
  AssesessmentType,
  GradeSchema,
  GradeType,
  Semester,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useFetchRequiredData } from "../_hooks/use-fetch-required-data";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import { useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import LoadingState from "@/components/customComponents/Loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { SaveAll } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StudentResponseType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Route } from "next";

type ScoresType = {
  onSubmit: (values: GradeType) => void;
  isSubmitting?: boolean;
  defaultValues?: GradeType;
  students?: StudentResponseType[];
  fetchStudentsError?: string;
  isPending?: boolean;
};

export const CreateStudentScoresForm = ({
  onSubmit,
  isSubmitting,
  defaultValues,
  students,
  fetchStudentsError,
  isPending,
}: ScoresType) => {
  const form = useForm<GradeType>({
    resolver: zodResolver(GradeSchema),
    mode: "onBlur",
    defaultValues: defaultValues
      ? defaultValues
      : {
          classId: "",
          courseId: "",
          assessmentType: undefined,
          scores: [],
          maxScore: 0,
          weight: 1,
          semester: undefined,
          academicYear: new Date().getFullYear(),
          remarks: "",
        },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "scores",
  });

  const selectedClass = useWatch({
    control: form.control,
    name: "classId",
  });

  const selectedCourse = useWatch({
    control: form.control,
    name: "courseId",
  });

  const selectedSemester = useWatch({
    control: form.control,
    name: "semester",
  });
  const selectedAcademicYear = useWatch({
    control: form.control,
    name: "academicYear",
  });
  const selectedAssessmentType = useWatch({
    control: form.control,
    name: "assessmentType",
  });

  const maxScore = useWatch({
    control: form.control,
    name: "maxScore",
  });

  const debouncedNavigate = useDebouncedCallback((params) => {
    router.push(`${pathname}?${params.toString()}` as Route);
  }, 300);

  useEffect(() => {
    if (!students || students.length === 0) return;

    const newScores = students.map((student) => ({
      ...student,
      studentId: student.id,
      score: 0,
    }));
    replace(newScores);
  }, [students, replace]);

  useEffect(() => {
    const allParamsPresent =
      selectedClass &&
      selectedCourse &&
      selectedSemester &&
      selectedAcademicYear &&
      selectedAssessmentType;
    if (!allParamsPresent) return;

    const params = new URLSearchParams(searchParams);
    params.set("classID", selectedClass);
    params.set("courseID", selectedCourse);
    params.set("semester", selectedSemester);
    params.set("academicYear", String(selectedAcademicYear));
    params.set("assessmentType", selectedAssessmentType);

    debouncedNavigate(params);
  }, [
    selectedClass,
    selectedCourse,
    selectedSemester,
    selectedAcademicYear,
    selectedAssessmentType,
    searchParams,
    debouncedNavigate,
  ]);

  const { classes, courses, fetchError } = useFetchRequiredData();

  const years = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  }, []);

  const handleSubmit = (values: GradeType) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 border p-3 rounded-md"
      >
        {fetchError && <div className="text-red-500">{fetchError}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SelectWithLabel
            name="classId"
            fieldTitle="Class"
            data={classes || []}
            valueKey="id"
            selectedKey="name"
            schema={GradeSchema}
            placeholder="Select Class"
          />
          <SelectWithLabel
            name="courseId"
            fieldTitle="Course"
            data={courses || []}
            valueKey="id"
            selectedKey="title"
            schema={GradeSchema}
            placeholder="Select Course"
          />
          <SelectWithLabel
            name="semester"
            fieldTitle="Semester"
            data={Semester as any}
            schema={GradeSchema}
            placeholder="Select Semester"
          />
          <SelectWithLabel
            name="academicYear"
            fieldTitle="Academic Year"
            data={years}
            schema={GradeSchema}
            placeholder="Select Academic Year"
          />
          <SelectWithLabel
            name="assessmentType"
            fieldTitle="Assessment Type"
            data={AssesessmentSchema as any}
            schema={GradeSchema}
            placeholder="Select Assessment Type"
          />
          <InputWithLabel
            type="number"
            name="maxScore"
            fieldTitle="Max Score"
            schema={GradeSchema}
            placeholder="Enter Max Score"
          />
        </div>
        {fetchStudentsError && <ErrorComponent error={fetchStudentsError} />}

        {isPending && <LoadingState />}

        {students && students.length > 0 ? (
          <div className=" w-full border rounded-md mt-4 overflow-auto scrollbar-thin">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="sr-only">Student</TableHead>
                  <TableHead>Avatar</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Student ID
                  </TableHead>
                  <TableHead>First Name</TableHead>
                  <TableHead>Last Name</TableHead>
                  <TableHead className="hidden md:table-cell">Gender</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields &&
                  fields.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="sr-only">
                        <FormField
                          control={form.control}
                          name={`scores.${index}.studentId`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  value={field.value}
                                  onChange={field.onChange}
                                  readOnly
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TableCell>
                      <TableCell>
                        <Avatar>
                          <AvatarImage
                            src={
                              students[index]?.user?.image || "/no-avatar.jpg"
                            }
                          />
                          <AvatarFallback>
                            {students[index]?.firstName.charAt(0)}
                            {students[index]?.lastName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {students[index]?.studentNumber}
                      </TableCell>
                      <TableCell>{students[index]?.firstName}</TableCell>
                      <TableCell>{students[index]?.lastName}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {students[index]?.gender}
                      </TableCell>
                      <TableCell>
                        <InputWithLabel
                          name={`scores.${index}.score`}
                          fieldTitle=""
                          placeholder="Enter Score"
                          type="number"
                          disabled={maxScore < 1 || maxScore === undefined}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        ) : !selectedClass ||
          !selectedCourse ||
          !selectedSemester ||
          !selectedAcademicYear ||
          !selectedAssessmentType ||
          !students ? (
          <div className="text-sm text-muted-foreground">
            Kindly select the class, course, semester and academic year and
            assessment type
          </div>
        ) : (
          <div
            className={cn(
              "w-full flex items-center justify-center text-sm text-muted-foreground",
            )}
          >
            No students found for the selected class, course, semester and
            academic year. It seems all students have scores entered for them in
            the assessment type you have selected.
          </div>
        )}

        {students && students.length > 0 && (
          <div className="flex justify-center">
            <LoadingButton
              className="md:w-auto"
              loading={isSubmitting as boolean}
            >
              {isSubmitting ? (
                <>Saving Scores</>
              ) : (
                <>
                  <SaveAll /> Save Scores
                </>
              )}
            </LoadingButton>
          </div>
        )}
      </form>
    </Form>
  );
};
