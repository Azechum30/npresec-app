"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { REGIONS } from "@/lib/constants";
import {
  AcademicHistorySchema,
  AcademicHistoryType,
  BioDataSchema,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useStudentEnrollmentStore } from "../_utils/store";

export const AcademicHistoryForm = () => {
  const { academicHistory, actions } = useStudentEnrollmentStore();
  const form = useForm<AcademicHistoryType>({
    mode: "onChange",
    resolver: zodResolver(AcademicHistorySchema),
    defaultValues: academicHistory ?? {
      aggregateScore: undefined,
      district: "",
      enrollmentCode: "",
      jhsAttended: "",
      jhsIndexNumber: "",
      schoolLocation: "",
      schoolRegion: "",
    },
  });

  const academicHistoryInfo = useWatch({
    control: form.control,
  });

  useEffect(() => {
    actions.setAcademicHistory(academicHistoryInfo);
  }, [actions, academicHistoryInfo]);

  const handleSubmit = (values: AcademicHistoryType) => {
    actions.setAcademicHistory(values);
    actions.nextStep();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 rounded-md p-4 border h-full max-h-[60vh] overflow-y-auto scrollbar-thin">
        <fieldset className="border p-3 rounded-md space-y-4">
          <legend className="text-base font-bold p-1.5">
            Section B: Academic History
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputWithLabel
              name="enrollmentCode"
              fieldTitle="Enrollment Code"
              placeholder="Enrollment code"
              schema={AcademicHistorySchema}
            />
            <InputWithLabel
              name="jhsIndexNumber"
              fieldTitle="JHS Index Number"
              placeholder="BECE index number"
              schema={AcademicHistorySchema}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputWithLabel
              name="jhsAttended"
              fieldTitle="JHS Attended"
              placeholder="JHS attended"
              schema={AcademicHistorySchema}
            />
            <InputWithLabel
              name="aggregateScore"
              fieldTitle="Aggregate Score"
              placeholder="Aggregate score"
              schema={AcademicHistorySchema}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputWithLabel
              name="schoolLocation"
              fieldTitle="School Location"
              schema={AcademicHistorySchema}
              placeholder="location of school"
            />

            <InputWithLabel
              name="district"
              fieldTitle="District"
              placeholder="District school is located"
              schema={BioDataSchema}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <SelectWithLabel
              name="schoolRegion"
              fieldTitle="Region"
              schema={BioDataSchema}
              placeholder="Region school is located"
              data={REGIONS}
            />
          </div>
        </fieldset>
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
          <Button
            onClick={() => actions.prevStep()}
            type="button"
            className="w-full sm:w-1/4"
            variant="outline">
            <ChevronLeft className="size-5" />
            Previous
          </Button>
          <LoadingButton
            disabled={!form.formState.isValid}
            className="w-full sm:w-1/4"
            loading={form.formState.isSubmitting}>
            Save and Continue
          </LoadingButton>
          <Button
            disabled={!form.formState.isValid}
            onClick={actions.nextStep}
            type="button"
            className="w-full sm:w-1/4"
            variant="outline">
            Next
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </form>
    </Form>
  );
};
