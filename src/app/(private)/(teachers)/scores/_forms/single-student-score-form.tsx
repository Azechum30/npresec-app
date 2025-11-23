"use client";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import {
  AssesessmentSchema,
  Semester,
  SingleStudentScoreSchema,
  SingleStudentScoreType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useFetchRequiredData } from "../_hooks/use-fetch-required-data";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Plus, Save } from "lucide-react";
import { useMemo } from "react";

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

  const handleSubmit = (data: SingleStudentScoreType) => {
    onSubmitAction(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8 border p-3 rounded-md">
          {fetchError && <ErrorComponent error={fetchError} />}
          <div className="sr-only">
            <InputWithLabel<SingleStudentScoreType>
              name="studentId"
              fieldTitle="Student ID"
              schema={SingleStudentScoreSchema}
              placeholder="Enter Student ID"
            />
          </div>
          <InputWithLabel<SingleStudentScoreType>
            name="studentName"
            fieldTitle="Student Name"
            schema={SingleStudentScoreSchema}
            placeholder="Enter Student Name"
            disabled={!!id}
          />
          <SelectWithLabel<SingleStudentScoreType>
            name="classId"
            fieldTitle="Class"
            data={classes ?? []}
            valueKey="id"
            selectedKey="name"
            schema={SingleStudentScoreSchema}
            placeholder="Select Class"
            disabled={!!id}
          />
          <SelectWithLabel<SingleStudentScoreType>
            name="courseId"
            fieldTitle="Course"
            data={courses ?? []}
            valueKey="id"
            selectedKey="title"
            schema={SingleStudentScoreSchema}
            placeholder="Select Course"
            disabled={!!id}
          />
          <SelectWithLabel<SingleStudentScoreType>
            name="semester"
            fieldTitle="Semester"
            data={Semester as any}
            schema={SingleStudentScoreSchema}
            placeholder="Select Semester"
            disabled={!!id}
          />
          <SelectWithLabel<SingleStudentScoreType>
            name="academicYear"
            fieldTitle="Academic Year"
            data={years}
            schema={SingleStudentScoreSchema}
            placeholder="Select Academic Year"
            disabled={!!id}
          />
          <SelectWithLabel<SingleStudentScoreType>
            name="assessmentType"
            fieldTitle="Assessment Type"
            data={AssesessmentSchema as any}
            schema={SingleStudentScoreSchema}
            placeholder="Select Assessment Type"
            disabled={!!id}
          />
          <InputWithLabel<SingleStudentScoreType>
            name="maxScore"
            fieldTitle="Max Score"
            schema={SingleStudentScoreSchema}
            placeholder="Enter Max Score"
            disabled={!!id}
          />
          <InputWithLabel<SingleStudentScoreType>
            name="score"
            fieldTitle="Score"
            schema={SingleStudentScoreSchema}
            placeholder="Enter Score"
          />
          <div>
            <LoadingButton loading={isPending as boolean}>
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
    </>
  );
};
