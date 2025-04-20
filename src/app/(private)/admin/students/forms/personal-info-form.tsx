"use client";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form, FormDescription } from "@/components/ui/form";
import { PersonalInfoSchema, PersonalInfoType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useStudentStore } from "../store";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useCancelEditStudent } from "../hooks/use-cancel-edit-student";
import FileUploadInput from "@/components/customComponents/FileUploadInput";

type PersonalInfoFormProps = {
  defaultValues?: PersonalInfoType;
};

export default function PersonalInfoForm({
  defaultValues,
}: PersonalInfoFormProps) {
  const { actions, isEditing, personalInfo } = useStudentStore();

  const form = useForm<PersonalInfoType>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: personalInfo,
  });

  useEffect(() => {
    const subscription = form.watch((data) => {
      actions.setPersonalInfo(data);
    });

    return () => subscription.unsubscribe();
  }, [actions.setPersonalInfo, form]);

  const { handleCancel } = useCancelEditStudent();

  function onSubmit(data: PersonalInfoType) {
    actions.setPersonalInfo(data);
    actions.NextStep();
  }

  const { isDirty, isValid } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto">
        <div className="border-b pb-3">
          <h1 className="text-lg font-semibold">Personal Information</h1>
          <FormDescription>
            Kindly provide the right information to each of the fields. Fields
            marked with asterisk(*) are mandatory and should not be left empty.
          </FormDescription>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="firstName"
              fieldTitle="First Name"
              schema={PersonalInfoSchema}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="lastName"
              fieldTitle="Last Name"
              schema={PersonalInfoSchema}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="middleName"
              fieldTitle="Middle Name"
              schema={PersonalInfoSchema}
            />
          </div>
          <div className="w-full">
            <SelectWithLabel<PersonalInfoType>
              name="gender"
              fieldTitle="Gender"
              data={["Male", "Female"]}
              schema={PersonalInfoSchema}
              placeholder="--Select your gender--"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full">
            <DatePickerWithLabel<PersonalInfoType>
              name="birthDate"
              fieldTitle="Date of Birth"
              schema={PersonalInfoSchema}
              className="max-w-4xl"
            />
          </div>
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="email"
              fieldTitle="Email"
              schema={PersonalInfoSchema}
              placeholder="johndoe@example.com"
              className="max-w-4xl"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="phone"
              fieldTitle="Phone Number"
              schema={PersonalInfoSchema}
              className="max-w-4xl"
            />
          </div>
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="nationality"
              fieldTitle="Nationality"
              schema={PersonalInfoSchema}
              placeholder="e.g. Ghanaian"
              className="max-w-4xl"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="religion"
              fieldTitle="Religion"
              schema={PersonalInfoSchema}
              placeholder="e.g. Christianity"
              className="max-w-4xl"
            />
          </div>
          <div className="w-full">
            <InputWithLabel<PersonalInfoType>
              name="address"
              fieldTitle="Address"
              schema={PersonalInfoSchema}
              placeholder="e.g. 125 John Agama Street, Accra"
              className="max-w-4xl"
            />
          </div>
        </div>

        <FileUploadInput<PersonalInfoType>
          name="imageFile"
          fieldTitle="Profile Image"
          className="max-w-4xl"
        />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <LoadingButton loading={false} className="md:w-fit">
              {isEditing ? "Save Changes" : "Save and Continue"}
            </LoadingButton>
            {isEditing && (
              <LoadingButton
                loading={false}
                className="md:w-fit"
                type="button"
                variant="destructive"
                onClick={handleCancel}>
                Cancel
              </LoadingButton>
            )}
          </div>
          <LoadingButton
            loading={false}
            className="md:w-fit"
            variant="outline"
            type="button"
            onClick={() => isValid && actions.NextStep()}
            disabled={isEditing ? !isValid : !isDirty || !isValid}>
            Next <ChevronRight className="size-5" />
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
