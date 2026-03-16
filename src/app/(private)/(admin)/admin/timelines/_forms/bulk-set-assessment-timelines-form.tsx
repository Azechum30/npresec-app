"use client";

import { Form } from "@/components/ui/form";
import {
  AssesessmentSchema,
  BulkAssessmentTimelinesSchema,
  BulkAssessmentTimelinesType,
  Semester,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getCourses } from "../../courses/actions/actions";

import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Plus } from "lucide-react";

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

  const [courses, setCourses] = useState<
    { id: string; title: string }[] | undefined
  >();

  useEffect(() => {
    startTransition(async () => {
      const res = await getCourses();

      if (res.error) return;

      setCourses(res.courses);
    });
  }, []);

  const handleFormSubmit = (values: BulkAssessmentTimelinesType) => {
    onSubmitAction(values);
  };

  return (
    <>
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
            data={AssesessmentSchema as any}
            schema={BulkAssessmentTimelinesSchema}
            placeholder="--- Select assessment mode ---"
          />
          <SelectWithLabel
            name="semester"
            fieldTitle="Semester"
            data={Semester as any}
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
                <Plus className="size-5" />
                Create Timelines
              </>
            )}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
