"use client";

import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import {
  AssessmentTimeline,
  AssessmentTimelineSchema,
  AssessmentTypes,
  Semester,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircleIcon, Save } from "lucide-react";
import { FC, startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getCourses } from "../../courses/actions/actions";

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

  const [courses, setCourses] = useState<
    { id: string; title: string }[] | undefined
  >();

  useEffect(() => {
    startTransition(async () => {
      const result = await getCourses();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setCourses(result.courses);
    });
  }, []);

  const handleFormSubmit = (data: AssessmentTimeline) => {
    onSubmitAction(data);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-6 p-4 max-h-[80vh] rounded-md border overflow-auto scrollbar-thin">
          <SelectWithLabel
            name="courseId"
            fieldTitle="Course"
            schema={AssessmentTimelineSchema}
            data={courses ?? []}
            valueKey="id"
            selectedKey="title"
            placeholder="--- select course ---"
          />
          <SelectWithLabel
            name="assessmentType"
            fieldTitle="Assessment Mode"
            schema={AssessmentTimelineSchema}
            data={AssessmentTypes as any}
            placeholder="--- select assessment mode ---"
          />
          <SelectWithLabel
            name="semester"
            fieldTitle="Semester"
            schema={AssessmentTimelineSchema}
            data={Semester as any}
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
            {!!id ? (
              <>
                {isPending ? (
                  <>
                    <Save className="size-5" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-5" />
                    Save Timeline
                  </>
                )}
              </>
            ) : (
              <>
                {isPending ? (
                  <>
                    <PlusCircleIcon className="size-5" />
                    Creating Timeline...
                  </>
                ) : (
                  <>
                    <PlusCircleIcon className="size-5" />
                    Create Timeline
                  </>
                )}
              </>
            )}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
