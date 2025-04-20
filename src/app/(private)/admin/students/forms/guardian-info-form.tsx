import { GuardianInfoSchema, GuardianInfoType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useStudentStore } from "../store";
import { useEffect } from "react";
import { Form, FormDescription } from "@/components/ui/form";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCancelEditStudent } from "../hooks/use-cancel-edit-student";

export default function GuardianInfoForm() {
  const { isEditing, guardianInfo, actions } = useStudentStore();
  const form = useForm<GuardianInfoType>({
    resolver: zodResolver(GuardianInfoSchema),
    defaultValues: guardianInfo,
    mode: "onChange",
  });

  useEffect(() => {
    const subscriptions = form.watch((data) => {
      actions.setGuardianInfo(data);
    });
    return () => subscriptions.unsubscribe();
  }, [actions.setGuardianInfo, form]);

  const { handleCancel } = useCancelEditStudent();

  function handleSubmit(data: GuardianInfoType) {
    try {
      actions.setGuardianInfo(data);
      actions.NextStep();
    } catch (error) {
      console.error(error);
    }
  }

  const handleNextStep = () => {
    if (form.formState.isValid) {
      actions.NextStep();
    }
  };

  const { isValid, isDirty } = form.formState;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto">
          <div className="border-b pb-3">
            <h1 className="text-lg font-semibold">
              Parent/Guardian Information
            </h1>
            <FormDescription>
              Kindly provide the right information to each of the fields. Fields
              marked with asterisk(*) are mandatory and should not be left
              empty.
            </FormDescription>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <InputWithLabel<GuardianInfoType>
                name="guardianName"
                fieldTitle="Full Name"
                schema={GuardianInfoSchema}
                className="max-w-3xl"
              />
            </div>
            <div className="w-full">
              <InputWithLabel<GuardianInfoType>
                name="guardianPhone"
                fieldTitle="Phone Number"
                schema={GuardianInfoSchema}
                className="max-w-3xl"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <InputWithLabel<GuardianInfoType>
                name="guardianEmail"
                fieldTitle="Email"
                schema={GuardianInfoSchema}
                className="max-w-3xl"
              />
            </div>
            <div className="w-full">
              <SelectWithLabel<GuardianInfoType>
                name="guardianRelation"
                fieldTitle="Relation"
                data={[
                  "Father",
                  "Mother",
                  "Uncle",
                  "Aunt",
                  "GrandParent",
                  "Sibling",
                  "Foster Parent",
                ]}
                schema={GuardianInfoSchema}
                placeholder="--select student's relation with guardian--"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full">
              <TextAreaWithLabel<GuardianInfoType>
                name="guardianAddress"
                fieldTitle="Address"
                placeholder="e.g. 125 Oxford Street, Accra"
                className="max-w-5xl"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <LoadingButton
                loading={false}
                type="button"
                variant="outline"
                onClick={() => actions.PrevStep()}
                className="md:w-fit">
                <ChevronLeft className="size-5" /> Previous
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
            <div className="flex flex-col md:flex-row items-center gap-3">
              <LoadingButton loading={false} className="md:w-fit">
                {isEditing ? "Save Changes" : "Save and Continue"}
              </LoadingButton>
              <LoadingButton
                loading={false}
                type="button"
                variant="outline"
                onClick={handleNextStep}
                className="md:w-fit"
                disabled={isEditing ? !isValid : !isDirty || !isValid}>
                Next
                <ChevronRight className="size-5" />
              </LoadingButton>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
