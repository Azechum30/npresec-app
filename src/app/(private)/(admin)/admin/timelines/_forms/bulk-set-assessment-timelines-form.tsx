/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { Form } from "@/components/ui/form";
import {
  type AssesessmentSchema,
  BulkAssessmentTimelinesSchema,
  type BulkAssessmentTimelinesType,
  type Semester,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { type FC, useMemo } from "react";
import { useForm } from "react-hook-form";

import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { coursesQueryOptions } from "../../courses/actions/queries";

type FormProps = {
  onSubmitAction: (data: BulkAssessmentTimelinesType) => void;
  isPending?: boolean;
};

export const SetAssessmentTimelinesForm: FC<FormProps> = ({
  onSubmitAction,
  isPending,
}) => {
  const form = useForm<BulkAssessmentTimelinesType>({
    resolver: zodResolver(BulkAssessmentTimelinesSchema),
    mode: "onChange",
    defaultValues: {
      academicYear: undefined,
      assessmentType: "" as (typeof AssesessmentSchema)[number],
      semester: "" as (typeof Semester)[number],
      endDate: undefined,
      startDate: undefined,
      courseIds: [],
    },
  });

  const { data, isLoading } = useQuery({
    ...coursesQueryOptions,
  });

  const courses = useMemo(() => {
    if (!data) return [];
    return data.map((cs) => ({ id: cs.id, title: cs.title }));
  }, [data]);

  const handleFormSubmit = (values: BulkAssessmentTimelinesType) => {
    onSubmitAction(values);
  };

  if (isLoading || !data) return <ShowLoadingState />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 p-3 rounded-md border max-h-[75vh] overflow-auto scrollbar-thin">
        <MultiSelectCombox
          name="courseIds"
          fieldTitle="Courses"
          data={courses ?? []}
          selectedKey="title"
          valueKey="id"
          schema={BulkAssessmentTimelinesSchema}
          placeholder="--- Select course ---"
        />

        <SelectWithLabel
          name="assessmentType"
          fieldTitle="Assessment Mode"
          data={["Assignment", "Midterm", "Project", "Examination"]}
          schema={BulkAssessmentTimelinesSchema}
          placeholder="--- Select assessment mode ---"
        />
        <SelectWithLabel
          name="semester"
          fieldTitle="Semester"
          data={["First", "Second"]}
          schema={BulkAssessmentTimelinesSchema}
          placeholder="--- Select assessment mode ---"
        />
        <SelectWithLabel
          name="academicYear"
          fieldTitle="Academic"
          data={Array.from(
            { length: 6 },
            (_, i) => new Date().getFullYear() - 5 + i,
          )}
          schema={BulkAssessmentTimelinesSchema}
          placeholder="--- Select assessment mode ---"
        />

        <fieldset className="rounded-md border p-3 space-y-4">
          <legend className="text-sm px-2 font-bold">Timelines</legend>

          <DatePickerWithLabel
            name="startDate"
            fieldTitle="Start Date"
            startDate={new Date().getFullYear() - 5}
            endDate={new Date().getFullYear()}
            schema={BulkAssessmentTimelinesSchema}
          />
          <DatePickerWithLabel
            name="endDate"
            fieldTitle="End Date"
            startDate={new Date().getFullYear() - 5}
            endDate={new Date().getFullYear()}
            schema={BulkAssessmentTimelinesSchema}
          />
        </fieldset>

        <LoadingButton
          loading={isPending as boolean}
          disabled={isPending || !form.formState.isValid}>
          {isPending ? (
            <>Creating timelines...</>
          ) : (
            <>
              <PlusCircle className="size-5" /> <span>Create</span>
            </>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
