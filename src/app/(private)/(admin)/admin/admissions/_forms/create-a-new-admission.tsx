"use client";

import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { Programmes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ADMISSION_STATUS,
  FreshAdmissionsSchema,
  FreshAdmissionsType,
  Gender,
  RESIDENTIAL_STATUS,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type FreshAdmissionProps = {
  onSubmitAction: (data: FreshAdmissionsType) => void;
  id?: string;
  defaultValues?: FreshAdmissionsType;
  isPending: boolean;
};

export const CreateANewAdmissionForm = ({
  onSubmitAction,
  id,
  defaultValues,
  isPending,
}: FreshAdmissionProps) => {
  const form = useForm<FreshAdmissionsType>({
    mode: "onChange",
    resolver: zodResolver(FreshAdmissionsSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          admissionStatus: ADMISSION_STATUS.PENDING,
          aggregateScore: 0,
          birthDate: new Date(),
          district: "",
          enrollmentCode: "",
          gender: Gender.MALE,
          guardianName: "",
          guardianPhoneNumber: "",
          hometown: "",
          isAcceptancePaid: false,
          isFormSubmitted: false,
          jhsAttended: "",
          jhsIndexNumber: "",
          lastName: "",
          otherNames: "",
          primaryAddress: "",
          programme: "",
          schoolRegion: "",
          guardianRelation: "",
          residentialStatus: RESIDENTIAL_STATUS.DAY,
          schoolLocation: "",
        },
  });

  const { onClose } = useGenericDialog();

  const handleSubmit = (values: FreshAdmissionsType) => {
    onSubmitAction(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 border rounded-md p-4 w-full max-h-[80vh] overflow-y-auto scrollbar-thin">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full">
              <InputWithLabel
                name="jhsIndexNumber"
                fieldTitle="JHS Index Number"
                placeholder="BECE index number"
                schema={FreshAdmissionsSchema}
                disabled={!!id}
              />
            </div>
            <div className="w-full">
              <InputWithLabel
                name="lastName"
                fieldTitle="Surname"
                placeholder="Surname"
                schema={FreshAdmissionsSchema}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full">
              <InputWithLabel
                name="otherNames"
                fieldTitle="Other Names"
                placeholder="Other names"
                schema={FreshAdmissionsSchema}
              />
            </div>
            <div className="w-full">
              <SelectWithLabel
                name="gender"
                fieldTitle="Gender"
                placeholder="Choose gender"
                data={[Gender.FEMALE, Gender.MALE]}
                schema={FreshAdmissionsSchema}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full">
              <SelectWithLabel
                name="residentialStatus"
                fieldTitle="Residential Status"
                placeholder="Choose residential status"
                data={[RESIDENTIAL_STATUS.BOARDING, RESIDENTIAL_STATUS.DAY]}
                schema={FreshAdmissionsSchema}
              />
            </div>
            <div className="w-full">
              <SelectWithLabel
                name="programme"
                fieldTitle="Programme"
                placeholder="Choose programme"
                data={Programmes as any}
                schema={FreshAdmissionsSchema}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full">
              <InputWithLabel
                name="aggregateScore"
                fieldTitle="Aggregate Score"
                placeholder="E.g 6, 7, 12, etc"
                schema={FreshAdmissionsSchema}
              />
            </div>
            <div className="w-full">
              <InputWithLabel
                name="jhsAttended"
                fieldTitle="JHS School Attended"
                placeholder="JHS Attended"
                schema={FreshAdmissionsSchema}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full">
              <DatePickerWithLabel
                name="birthDate"
                fieldTitle="Date of Birth"
                startDate={new Date().getFullYear() - 14}
                schema={FreshAdmissionsSchema}
              />
            </div>
            <div className="w-full">
              <InputWithLabel
                name="guardianPhoneNumber"
                fieldTitle="Guardian Contact"
                placeholder="Guardian phone number"
                schema={FreshAdmissionsSchema}
              />
            </div>
          </div>
          <div className="border-t pt-4 flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4">
            <LoadingButton
              className={cn("w-full sm:w-1/5", isPending && "animate-pulse")}
              loading={isPending}
              disabled={!form.formState.isValid}>
              {isPending ? (
                <>{!!id ? "Editing..." : "Adding..."}</>
              ) : (
                <>{!!id ? "Save" : "Add Student"}</>
              )}
            </LoadingButton>
            <Button
              onClick={() => onClose(!!id ? "edit-admission" : "new-admission")}
              type="button"
              className="w-full sm:w-1/5"
              variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};
