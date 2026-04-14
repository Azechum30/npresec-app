"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ParentOrGuardianSchema, ParentOrGuardianType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useStudentEnrollmentStore } from "../_utils/store";

export const ParentOrGuardianForm = () => {
  const { parentOrGuardian, actions } = useStudentEnrollmentStore();
  const form = useForm<ParentOrGuardianType>({
    mode: "onChange",
    resolver: zodResolver(ParentOrGuardianSchema),
    defaultValues: parentOrGuardian ?? {
      guardianEmail: "",
      guardianName: "",
      guardianPhoneNumber: "",
      guardianRelation: "",
    },
  });

  const parentOrGuardianInfo = useWatch({
    control: form.control,
  });

  useEffect(() => {
    actions.setParentOrGuardian(parentOrGuardianInfo);
  }, [actions, parentOrGuardianInfo]);

  const handleSubmit = (values: ParentOrGuardianType) => {
    actions.setParentOrGuardian(values);
    actions.nextStep();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 rounded-md p-4 border h-full max-h-[60vh] overflow-y-auto scrollbar-thin">
        <fieldset className="border p-3 rounded-md space-y-4">
          <legend className="text-base font-bold p-1.5">
            Section C: Parent or Guardian Data
          </legend>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <InputWithLabel
                name="guardianName"
                fieldTitle="Parent/Guardian Name"
                placeholder="parent or guardian name"
                schema={ParentOrGuardianSchema}
              />
            </div>
            <SelectWithLabel
              name="guardianRelation"
              fieldTitle="Relationship"
              placeholder="Student's relationship parent or guardian"
              schema={ParentOrGuardianSchema}
              data={[
                "Father",
                "Mother",
                "Uncle",
                "Auntie",
                "Brother",
                "Sister",
                "Cousin",
                "Grandfather",
                "Grandmother",
                "Step-father",
                "Step-mother",
                "Foster parent",
              ]}
            />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <InputWithLabel
                name="guardianPhoneNumber"
                fieldTitle="Phone Number"
                placeholder="phone number"
                schema={ParentOrGuardianSchema}
              />
            </div>
            <div>
              <InputWithLabel
                name="guardianEmail"
                fieldTitle="Email"
                type="email"
                placeholder="kojoanani@example.com"
                schema={ParentOrGuardianSchema}
              />
            </div>
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
