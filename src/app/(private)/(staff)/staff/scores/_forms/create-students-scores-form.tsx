import AssessmentTimeLineCountDown from "@/components/customComponents/AssessmentTimelineCountDown";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingState from "@/components/customComponents/Loading";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Notification } from "@/components/customComponents/notification";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { getAssessmentTimeline } from "@/lib/get-assessment-time-line";
import { StudentResponseType } from "@/lib/types";
import {
  AssesessmentSchema,
  GradeSchema,
  GradeType,
  Semester,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveAll } from "lucide-react";
import { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useDebouncedCallback } from "use-debounce";
import { useFetchRequiredData } from "../_hooks/use-fetch-required-data";

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
    mode: "onChange",
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
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const { dialogs } = useGenericDialog();

  const isValidParams = useMemo(() => {
    return !!(
      selectedClass &&
      selectedCourse &&
      selectedSemester &&
      selectedAcademicYear &&
      selectedAssessmentType
    );
  }, [
    selectedClass,
    selectedCourse,
    selectedSemester,
    selectedAcademicYear,
    selectedAssessmentType,
  ]);

  const isValidPeriod = useMemo(() => {
    if (!startDate || !endDate) return false;

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return now >= start && now <= end;
  }, [startDate, endDate]);

  const debouncedNavigate = useDebouncedCallback((params) => {
    router.push(`${pathname}?${params.toString()}` as Route);
  }, 300);

  useEffect(() => {
    if (!isValidPeriod) return;
    if (!students || students.length === 0) return;

    const currentIds = fields
      .map((f) => f.studentId)
      .sort()
      .join(",");
    const incomingIds = students
      .map((s) => s.id)
      .sort()
      .join(",");

    if (currentIds === incomingIds) return;

    const newScores = students.map((student) => ({
      ...student,
      studentId: student.id,
      score: 0,
    }));
    replace(newScores);
  }, [students, replace, fields, isValidPeriod]);

  useEffect(() => {
    if (!dialogs["create-students-scores"]) return;

    const allParamsPresent =
      selectedClass &&
      selectedCourse &&
      selectedSemester &&
      selectedAcademicYear &&
      selectedAssessmentType;
    if (!allParamsPresent) return;

    const currentUrlParams = new URLSearchParams(window.location.search);

    const isMatch =
      currentUrlParams.get("classID") === selectedClass &&
      currentUrlParams.get("courseID") === selectedCourse &&
      currentUrlParams.get("semester") === selectedSemester &&
      currentUrlParams.get("academicYear") === String(selectedAcademicYear) &&
      currentUrlParams.get("assessmentType") === selectedAssessmentType;

    if (isMatch) return;

    const params = new URLSearchParams(searchParams);
    params.set("classID", selectedClass);
    params.set("courseID", selectedCourse);
    params.set("semester", selectedSemester);
    params.set("academicYear", String(selectedAcademicYear));
    params.set("assessmentType", selectedAssessmentType);

    debouncedNavigate(params);

    startTransition(async () => {
      const res = await getAssessmentTimeline(
        selectedAssessmentType,
        selectedSemester,
        selectedAcademicYear,
        selectedCourse,
      );
      if (res.error) {
        setStartDate(undefined);
        setEndDate(undefined);
        return;
      }

      setStartDate(res.timeline?.startDate);
      setEndDate(res.timeline?.endDate);
    });
  }, [
    selectedClass,
    selectedCourse,
    selectedSemester,
    selectedAcademicYear,
    selectedAssessmentType,
    searchParams,
    debouncedNavigate,
    dialogs["create-students-scores"],
  ]);

  const { classes, courses, fetchError } = useFetchRequiredData();

  const years = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  }, []);

  const handleSubmit = (values: GradeType) => {
    onSubmit(values);
  };

  const now = new Date();

  return (
    <>
      {isValidPeriod && (
        <AssessmentTimeLineCountDown
          date={endDate as Date}
          countdownLabel="Time Left"
        />
      )}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 border p-3 rounded-md max-h-[65vh] w-full overflow-y-auto scrollbar-thin">
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

          {isValidParams && (!startDate || now < startDate) ? (
            <Notification description="It is either no timeline has been set for this assesment or the date for start of entry has not yet reached or all students have scores entered for them in this assessment mode." />
          ) : isValidParams && endDate && now > endDate ? (
            <Notification
              description="The time period for entering scores for this assessment mode has
                elapsed."
            />
          ) : isValidParams &&
            isValidPeriod &&
            students &&
            students.length > 0 ? (
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
                    <TableHead className="hidden md:table-cell">
                      Gender
                    </TableHead>
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
          ) : !isValidParams || !students ? (
            <Notification
              description="Kindly select the class, course, semester, academic year, and
              the mode of assessment to filter students for score entry. Be aware that the Max Score field refers to the total mark a student can obtain (overall score). Max score cannot exceed 100."
            />
          ) : (
            <Notification
              description="No students found for the selected class, course, semester and
              academic year. It seems all students have scores entered for them
              in the assessment type you have selected."
            />
          )}

          {students && students.length > 0 && isValidPeriod && (
            <div className="flex justify-center">
              <LoadingButton
                size="lg"
                className="md:w-[25%]"
                loading={isSubmitting as boolean}>
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
    </>
  );
};
