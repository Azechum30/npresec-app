"use client";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form, FormDescription } from "@/components/ui/form";
import { PersonalInfoSchema, PersonalInfoType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import FileUploadInput from "@/components/customComponents/FileUploadInput";
import { ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useCancelEditStudent } from "../hooks/use-cancel-edit-student";
import { useStudentStore } from "../store";

export default function PersonalInfoForm() {
  const { actions, isEditing, personalInfo } = useStudentStore();

  const form = useForm<PersonalInfoType>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: {
      ...personalInfo,
      address: personalInfo.address || "",
      middleName: personalInfo.middleName || "",
      phone: personalInfo.phone || "",
      nationality: personalInfo.nationality || "",
      religion: personalInfo.religion || "",
    },
    mode: "onBlur",
  });

  const personInfoData = useWatch({ control: form.control });

  useEffect(() => {
    actions.setPersonalInfo(personInfoData);
  }, [actions, personInfoData]);

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
            <InputWithLabel
              name="firstName"
              fieldTitle="First Name"
              schema={PersonalInfoSchema}
              className="w-full"
            />
          </div>
          <div className="w-full">
            <InputWithLabel
              name="lastName"
              fieldTitle="Last Name"
              schema={PersonalInfoSchema}
              className="w-full"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="w-full">
            <InputWithLabel
              name="middleName"
              fieldTitle="Middle Name"
              schema={PersonalInfoSchema}
            />
          </div>
          <div className="w-full">
            <SelectWithLabel
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
            <DatePickerWithLabel
              name="birthDate"
              fieldTitle="Date of Birth"
              schema={PersonalInfoSchema}
              className="max-w-4xl"
            />
          </div>
          <div className="w-full">
            <InputWithLabel
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
            <InputWithLabel
              name="phone"
              fieldTitle="Phone Number"
              schema={PersonalInfoSchema}
              className="max-w-4xl"
            />
          </div>
          <div className="w-full">
            <InputWithLabel
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
            <InputWithLabel
              name="religion"
              fieldTitle="Religion"
              schema={PersonalInfoSchema}
              placeholder="e.g. Christianity"
              className="max-w-4xl"
            />
          </div>
          <div className="w-full">
            <InputWithLabel
              name="address"
              fieldTitle="Address"
              schema={PersonalInfoSchema}
              placeholder="e.g. 125 John Agama Street, Accra"
              className="max-w-4xl"
            />
          </div>
        </div>

        <FileUploadInput
          name="imageFile"
          fieldTitle="Profile Image"
          className="max-w-4xl"
          photoURL={personalInfo.photoURL as string}
          isEditing={isEditing}
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
