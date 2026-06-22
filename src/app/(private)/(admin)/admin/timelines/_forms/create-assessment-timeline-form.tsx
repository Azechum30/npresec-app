/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { Form } from "@/components/ui/form";
import {
  type AssessmentTimeline,
  AssessmentTimelineSchema,
  type AssessmentTypes,
  type Semester,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { type FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import { coursesQueryOptions } from "../../courses/actions/queries";

type Props = {
  onSubmitAction: (data: AssessmentTimeline) => void;
  defaultValues?: AssessmentTimeline;
  id?: string;
  isPending?: boolean;
};

export const CreateAssessmentTimelineForm: FC<Props> = ({
  onSubmitAction,
  defaultValues,
  id,
  isPending,
}) => {
  const form = useForm<AssessmentTimeline>({
    resolver: zodResolver(AssessmentTimelineSchema),
    mode: "onBlur",
    defaultValues: defaultValues ?? {
      courseId: "",
      assessmentType: "" as (typeof AssessmentTypes)[number],
      academicYear: undefined,
      semester: "" as (typeof Semester)[number],
      startDate: undefined,
      endDate: undefined,
    },
  });

  const { data, isLoading } = useQuery({
    ...coursesQueryOptions,
  });

  const courses = useMemo(() => {
    if (!data) return [];
    return data.map((cs) => ({ id: cs.id, title: cs.title }));
  }, [data]);

  const handleFormSubmit = (data: AssessmentTimeline) => {
    onSubmitAction(data);
  };

  if (isLoading || !data) return <ShowLoadingState />;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-6 p-4 max-h-[80vh] rounded-md border overflow-auto scrollbar-thin">
        <SelectWithLabel
          name="courseId"
          fieldTitle="Course"
          schema={AssessmentTimelineSchema}
          data={courses}
          valueKey="id"
          selectedKey="title"
          placeholder="--- select course ---"
        />
        <SelectWithLabel
          name="assessmentType"
          fieldTitle="Assessment Mode"
          schema={AssessmentTimelineSchema}
          data={["Assignment", "Midterm", "Project", "Examination"]}
          placeholder="--- select assessment mode ---"
        />
        <SelectWithLabel
          name="semester"
          fieldTitle="Semester"
          schema={AssessmentTimelineSchema}
          data={["First", "Second"]}
          placeholder="--- select semester ---"
        />
        <SelectWithLabel
          name="academicYear"
          fieldTitle="Academic Year"
          schema={AssessmentTimelineSchema}
          data={Array.from(
            { length: 6 },
            (_, i) => new Date().getFullYear() - 5 + i,
          )}
          placeholder="--- select academic year ---"
        />

        <fieldset className="border p-4 rounded-md space-y-4">
          <legend className="px-2 text-sm">Score Entry Dates</legend>
          <DatePickerWithLabel
            name="startDate"
            fieldTitle="Start Date"
            startDate={new Date().getFullYear() - 5}
            endDate={new Date().getFullYear()}
            schema={AssessmentTimelineSchema}
          />
          <DatePickerWithLabel
            name="endDate"
            fieldTitle="End Date"
            startDate={new Date().getFullYear() - 5}
            endDate={new Date().getFullYear()}
            schema={AssessmentTimelineSchema}
          />
        </fieldset>

        <LoadingButton loading={isPending as boolean}>
          {id ? (
            isPending ? (
              "Saving"
            ) : (
              <>
                <PlusCircle className="size-5" /> <span>Save</span>
              </>
            )
          ) : isPending ? (
            "Creating"
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
