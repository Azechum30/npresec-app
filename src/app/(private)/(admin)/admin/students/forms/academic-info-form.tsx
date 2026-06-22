/**biome-ignore-all assist/source/organizeImports: reason */
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form, FormDescription } from "@/components/ui/form";
import { AcademicInfoSchema, type AcademicInfoType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { classQueryOptions } from "../../classes/actions/queries";
import { departmentsQueryOptions } from "../../departments/actions/queries";
import { useCancelEditStudent } from "../hooks/use-cancel-edit-student";
import { useAcademicInfo, useStudentStore } from "../store";

export default function AcademicInfoForm() {
  const { isEditing, academicInfo } = useStudentStore();
  const form = useForm<AcademicInfoType>({
    resolver: zodResolver(AcademicInfoSchema),
    defaultValues: academicInfo,
    mode: "onBlur",
  });

  const { actions } = useStudentStore();
  const academicInfoData = useAcademicInfo();
  const selectedDepartment = useWatch({
    control: form.control,
    name: "departmentId",
  });

  useEffect(() => {
    form.reset(academicInfoData);
  }, [form, academicInfoData]);

  const [classQueryData, departmentsQueryData] = useQueries({
    queries: [classQueryOptions, departmentsQueryOptions],
  });

  const departments = useMemo(() => {
    if (!departmentsQueryData.data) return [];

    return departmentsQueryData.data.map((dept) => ({
      id: dept.id,
      name: dept.name,
    }));
  }, [departmentsQueryData.data]);

  const classes = useMemo(() => {
    if (!selectedDepartment || !classQueryData.data) return [];

    return classQueryData.data
      .filter((cls) => cls.departmentId === selectedDepartment)
      .map((cls) => ({
        id: cls.id,
        name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
      }));
  }, [selectedDepartment, classQueryData.data]);

  const { handleCancel } = useCancelEditStudent();

  function handleSubmit(data: AcademicInfoType) {
    Promise.try(() => {
      actions.setAcademicInfo(data);
      actions.NextStep();
    });
  }

  const levels = [
    { id: "Year_One", name: "Year One" },
    { id: "Year_Two", name: "Year Two" },
    { id: "Year_Three", name: "Year Three" },
  ];

  const statuses = [
    "Active",
    "Inactive",
    "Withdrawn",
    "Graduated",
    "Suspended",
  ];

  const { isDirty, isValid } = form.formState;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto">
        <div className="border-b pb-3">
          <h1 className="text-lg font-semibold">Academic Information</h1>
          <FormDescription>
            Kindly provide the right information to each of the fields. Fields
            marked with asterisk(*) are mandatory and should not be left empty.
          </FormDescription>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <SelectWithLabel
              name="classId"
              fieldTitle="Assigned Class"
              data={classes}
              valueKey="id"
              selectedKey="name"
              schema={AcademicInfoSchema}
              placeholder="--Select class--"
            />
          </div>
          <div className="w-full">
            <SelectWithLabel
              name="departmentId"
              fieldTitle="Assigned Department"
              data={departments}
              valueKey="id"
              selectedKey="name"
              schema={AcademicInfoSchema}
              placeholder="--Select department--"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <SelectWithLabel
              name="currentLevel"
              fieldTitle="Current Level"
              data={levels}
              valueKey="id"
              selectedKey="name"
              schema={AcademicInfoSchema}
              placeholder="--Select current level--"
            />
          </div>
          <div className="w-full">
            <SelectWithLabel
              name="status"
              fieldTitle="Enrollement Status"
              data={statuses}
              valueKey="id"
              selectedKey="name"
              schema={AcademicInfoSchema}
              placeholder="--Select current enrollemt status--"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full max-w-4xl">
            <DatePickerWithLabel
              name="dateEnrolled"
              fieldTitle="Date Enrolled"
              schema={AcademicInfoSchema}
              className="max-w-3xl"
              startDate={new Date().getFullYear() - 6}
              endDate={new Date().getFullYear()}
              disableFutureDates={true}
            />
          </div>
          <div className="w-full">
            <DatePickerWithLabel
              name="graduationDate"
              fieldTitle="Graduation Date"
              schema={AcademicInfoSchema}
              className="max-w-3xl"
              disable={true}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <InputWithLabel
              name="previousSchool"
              fieldTitle="Previous School Attended"
              schema={AcademicInfoSchema}
              className="max-w-5xl"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between md:items-centern gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <LoadingButton
              loading={false}
              className="md:w-fit"
              variant="outline"
              type="button"
              onClick={() => actions.PrevStep()}>
              <ChevronLeft className="size-5" />
              Previous
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
          <div className="flex flex-col md:flex-row gap-2">
            <LoadingButton loading={false} className="md:w-fit ">
              {isEditing ? "Save Changes" : "Save and Continue"}
            </LoadingButton>
            <LoadingButton
              loading={false}
              className="md:w-fit disabled:cursor-not-allowed"
              variant="outline"
              type="button"
              onClick={() => isValid && actions.NextStep()}
              disabled={isEditing ? !isValid : !isDirty || !isValid}>
              Next
              <ChevronRight className="size-5" />
            </LoadingButton>
          </div>
        </div>
      </form>
    </Form>
  );
}
