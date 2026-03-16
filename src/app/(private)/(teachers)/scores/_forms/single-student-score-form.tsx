"use client";
import AssessmentTimeLineCountDown from "@/components/customComponents/AssessmentTimelineCountDown";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Notification } from "@/components/customComponents/notification";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { getAssessmentTimeline } from "@/lib/get-assessment-time-line";
import {
  AssesessmentSchema,
  Semester,
  SingleStudentScoreSchema,
  SingleStudentScoreType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { startTransition, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useFetchRequiredData } from "../_hooks/use-fetch-required-data";

type SingleStudentScoreFormProps = {
  onSubmitAction: (data: SingleStudentScoreType) => void;
  isPending?: boolean;
  defaultValues?: SingleStudentScoreType;
  id?: string;
};

export const SingleStudentScoreForm = ({
  onSubmitAction,
  isPending,
  defaultValues,
  id,
}: SingleStudentScoreFormProps) => {
  const form = useForm<SingleStudentScoreType>({
    resolver: zodResolver(SingleStudentScoreSchema),
    mode: "onBlur",
    defaultValues: defaultValues
      ? defaultValues
      : {
          classId: "",
          courseId: "",
          assessmentType: undefined,
          score: 0,
          studentId: "",
          maxScore: 0,
          weight: 1,
          semester: undefined,
          academicYear: new Date().getFullYear(),
          remarks: "",
        },
  });

  const years = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);
  }, []);
  const { classes, courses, fetchError } = useFetchRequiredData();

  const { dialogs } = useGenericDialog();

  const [endDate, setEndDate] = useState<Date>(() => new Date());
  const validPeriod = useMemo(() => endDate && new Date() < endDate, [endDate]);

  useEffect(() => {
    if (!dialogs["edit-student-score"]) return;
    startTransition(async () => {
      const res = await getAssessmentTimeline(
        defaultValues?.assessmentType as (typeof AssesessmentSchema)[number],
        defaultValues?.semester as (typeof Semester)[number],
        defaultValues?.academicYear as number,
        defaultValues?.courseId as string,
      );

      if (res.error) return;
      setEndDate(res.timeline?.endDate as Date);
    });
  }, [defaultValues, dialogs]);

  const handleSubmit = (data: SingleStudentScoreType) => {
    onSubmitAction(data);
  };

  return (
    <>
      {validPeriod ? (
        <AssessmentTimeLineCountDown
          date={endDate}
          countdownLabel="Time Left"
        />
      ) : (
        <Notification description="It is either the score entry timelines have elapsed or there are no timelines set for this mode of assessment to enable you update the student's score." />
      )}
      {validPeriod && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8 border p-3 rounded-md max-h-[65vh] overflow-auto scrollbar-thin">
            {fetchError && <ErrorComponent error={fetchError} />}
            <div className="sr-only">
              <InputWithLabel
                name="studentId"
                fieldTitle="Student ID"
                schema={SingleStudentScoreSchema}
                placeholder="Enter Student ID"
              />
            </div>
            <InputWithLabel
              name="studentName"
              fieldTitle="Student Name"
              schema={SingleStudentScoreSchema}
              placeholder="Enter Student Name"
              disabled={!!id}
            />
            <SelectWithLabel
              name="classId"
              fieldTitle="Class"
              data={classes ?? []}
              valueKey="id"
              selectedKey="name"
              schema={SingleStudentScoreSchema}
              placeholder="Select Class"
              disabled={!!id}
            />
            <SelectWithLabel
              name="courseId"
              fieldTitle="Course"
              data={courses ?? []}
              valueKey="id"
              selectedKey="title"
              schema={SingleStudentScoreSchema}
              placeholder="Select Course"
              disabled={!!id}
            />
            <SelectWithLabel
              name="semester"
              fieldTitle="Semester"
              data={Semester as any}
              schema={SingleStudentScoreSchema}
              placeholder="Select Semester"
              disabled={!!id}
            />
            <SelectWithLabel
              name="academicYear"
              fieldTitle="Academic Year"
              data={years}
              schema={SingleStudentScoreSchema}
              placeholder="Select Academic Year"
              disabled={!!id}
            />
            <SelectWithLabel
              name="assessmentType"
              fieldTitle="Assessment Type"
              data={AssesessmentSchema as any}
              schema={SingleStudentScoreSchema}
              placeholder="Select Assessment Type"
              disabled={!!id}
            />
            <InputWithLabel
              name="maxScore"
              fieldTitle="Max Score"
              schema={SingleStudentScoreSchema}
              placeholder="Enter Max Score"
              disabled={!!id}
            />
            <InputWithLabel
              name="score"
              fieldTitle="Score"
              schema={SingleStudentScoreSchema}
              placeholder="Enter Score"
              disabled={!validPeriod}
            />
            <div>
              <LoadingButton loading={!validPeriod || (isPending as boolean)}>
                {id ? (
                  <>
                    {" "}
                    <Save />
                    {isPending ? "Updating Score ..." : "Update Score"}
                  </>
                ) : (
                  <>
                    {" "}
                    <Plus /> {isPending ? "Creating Score..." : "Create Score"}
                  </>
                )}
              </LoadingButton>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};
