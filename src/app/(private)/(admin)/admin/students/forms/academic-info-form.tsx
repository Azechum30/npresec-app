import { Form, FormDescription } from "@/components/ui/form";
import { ClassesResponseType, DepartmentResponseType } from "@/lib/types";
import { AcademicInfoSchema, AcademicInfoType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { getServerSideProps } from "../../departments/actions/getServerSideProps";
import { getClassesAction } from "../../classes/actions/server-actions";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useStudentStore } from "../store";
import { useCancelEditStudent } from "../hooks/use-cancel-edit-student";

export default function AcademicInfoForm() {
  const { isEditing, academicInfo } = useStudentStore();
  const form = useForm<AcademicInfoType>({
    resolver: zodResolver(AcademicInfoSchema),
    defaultValues: {
      ...academicInfo,
      classId: academicInfo.classId || "",
      departmentId: academicInfo.departmentId || "",
      graduationDate: academicInfo.graduationDate || undefined,
      previousSchool: academicInfo.previousSchool || "",
    },
    mode: "onBlur",
  });

  const [classes, setClasses] = useState<
    Pick<ClassesResponseType, "id" | "name">[]
  >([]);
  const [departments, setDepartments] = useState<
    Pick<DepartmentResponseType, "id" | "name">[]
  >([]);

  const { actions } = useStudentStore();
  const academicInfoData = useWatch({ control: form.control });

  useEffect(() => {
    actions.setAcademicInfo(academicInfoData);
  }, [actions, academicInfoData]);

  useEffect(() => {
    const fetchData = async () => {
      const [departmentPromise, classPromise] = await Promise.all([
        getServerSideProps(),
        getClassesAction(),
      ]);

      if (departmentPromise.error) {
        return <div>An error has occurred!</div>;
      }

      if (classPromise.error) {
        return <div>An error has occurred!</div>;
      }

      if (departmentPromise.departments === undefined) return;
      if (classPromise.data === undefined) return;

      setClasses(() => {
        const newClass = classPromise.data.map((classItem) => ({
          id: classItem.id,
          name: classItem.name,
        }));
        return [...newClass];
      });

      setDepartments(() =>
        departmentPromise.departments.map((dept) => ({
          id: dept.id,
          name: dept.name,
        }))
      );
    };

    fetchData();
  }, []);

  const { handleCancel } = useCancelEditStudent();

  function handleSubmit(data: AcademicInfoType) {
    try {
      actions.setAcademicInfo(data);
      actions.NextStep();
    } catch (error) {
      console.log(error);
    }
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
            />
          </div>
          <div className="w-full">
            <DatePickerWithLabel
              name="graduationDate"
              fieldTitle="Graduation Date"
              schema={AcademicInfoSchema}
              className="max-w-3xl"
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
