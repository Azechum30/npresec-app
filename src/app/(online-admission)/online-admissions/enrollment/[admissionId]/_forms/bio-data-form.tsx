"use client";

import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { BioDataSchema, BioDataType, Gender } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useStudentEnrollmentStore } from "../_utils/store";

export const BioDataForm = () => {
  const { bioData, actions } = useStudentEnrollmentStore();
  const form = useForm<BioDataType>({
    mode: "onChange",
    resolver: zodResolver(BioDataSchema),
    defaultValues: bioData
      ? bioData
      : {
          birthDate: "",
          email: "",
          gender: "",
          hometown: "",
          lastName: "",
          otherNames: "",
          phone: "",
          primaryAddress: "",
        },
  });

  useEffect(() => {
    if (bioData && Object.keys(bioData).length > 0) {
      form.reset(bioData);
    }
  }, [bioData, form]);

  const bioDataInfo = useWatch({
    control: form.control,
  });

  useEffect(() => {
    if (form.formState.isDirty) {
      actions.setBioData(bioDataInfo);
    }
  }, [actions, bioDataInfo, form]);

  const handleSubmit = (values: BioDataType) => {
    actions.setBioData(values);
    actions.nextStep();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 rounded-md p-4 border h-full max-h-[60vh] overflow-y-auto scrollbar-thin">
        <fieldset className="border p-3 rounded-md space-y-4">
          <legend className="text-base font-bold p-1.5">
            Section A: Personal Information
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputWithLabel
                name="lastName"
                fieldTitle="Surname"
                placeholder="Surname"
                schema={BioDataSchema}
              />
            </div>
            <div>
              <InputWithLabel
                name="otherNames"
                fieldTitle="Other Names"
                placeholder="Other names"
                schema={BioDataSchema}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <DatePickerWithLabel
                name="birthDate"
                fieldTitle="Date of Birth"
                schema={BioDataSchema}
                startDate={new Date().getFullYear() - 20}
                endDate={new Date().getFullYear()}
              />
            </div>
            <div>
              <SelectWithLabel
                name="gender"
                fieldTitle="Gender"
                placeholder="gender"
                schema={BioDataSchema}
                data={[Gender.FEMALE, Gender.MALE]}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <InputWithLabel
                name="email"
                fieldTitle="Email (optional)"
                schema={BioDataSchema}
                type="email"
                placeholder="johndoe@example.com"
              />
            </div>
            <div>
              <InputWithLabel
                name="phone"
                fieldTitle="Phone Number (optional)"
                placeholder="Phone number"
                schema={BioDataSchema}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <InputWithLabel
                name="hometown"
                fieldTitle="Hometown"
                schema={BioDataSchema}
                placeholder="Hometown"
              />
            </div>
            <div>
              <TextAreaWithLabel
                name="primaryAddress"
                fieldTitle="Address"
                placeholder="Home or street address"
              />
            </div>
          </div>
        </fieldset>
        <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-2">
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
