/** biome-ignore-all assist/source/organizeImports: reason */
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import FileUploadInput from "@/components/customComponents/FileUploadInput";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RANKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  STAFF_CATEGORY,
  STAFF_TYPE,
  StaffSchema,
  type StaffType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { classQueryOptions } from "../../../classes/actions/queries";
import { coursesQueryOptions } from "../../../courses/actions/queries";
import { departmentsQueryOptions } from "../../../departments/actions/queries";

type CreateStaffProps = {
  onSubmitAction: (data: StaffType) => Promise<void>;
  id?: string;
  defaultValues?: StaffType;
  isPending: boolean;
};

export default function CreateStaffForm({
  onSubmitAction,
  id,
  defaultValues,
  isPending,
}: CreateStaffProps) {
  const form = useForm<StaffType>({
    resolver: zodResolver(StaffSchema),
    defaultValues: defaultValues ?? {
      firstName: "",
      lastName: "",
      middleName: "",
      employeeId: "",
      birthDate: new Date(),
      gender: "Male",
      maritalStatus: "Single",
      dateOfFirstAppointment: new Date(),
      phone: "",
      email: "",
      username: "",
      rank: "",
      academicQual: "",
      classes: [],
      courses: [],
      isDepartmentHead: false,
    },
  });

  const departmentId = useWatch({
    control: form.control,
    name: "departmentId",
  });
  const staffType = useWatch({
    control: form.control,
    name: "staffType",
  });
  const courseIds = useWatch({
    control: form.control,
    name: "courses",
  });

  const [departmentsQueryData, classQueryData, coursesQueryData] = useQueries({
    queries: [departmentsQueryOptions, classQueryOptions, coursesQueryOptions],
  });

  const departments = useMemo(() => {
    if (!departmentsQueryData.data) return [];

    return departmentsQueryData.data.map((dp) => ({
      id: dp.id,
      name: dp.name,
    }));
  }, [departmentsQueryData.data]);

  const classes = useMemo(() => {
    if (!courseIds || !classQueryData.data) return [];

    return classQueryData.data
      .filter((c) => c.courses.some((c) => courseIds.includes(c.id)))
      .map((cls) => ({
        id: cls.id,
        name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
      }));
  }, [courseIds, classQueryData.data]);

  const courses = useMemo(() => {
    if (!departmentId || !coursesQueryData.data) return [];

    return coursesQueryData.data
      .filter((c) => c.departments.some((dep) => dep.id === departmentId))
      .map((cs) => ({
        id: cs.id,
        title: cs.title,
      }));
  }, [departmentId, coursesQueryData.data]);

  const isLoading =
    departmentsQueryData.isLoading ||
    coursesQueryData.isLoading ||
    classQueryData.isLoading;

  if (isLoading) {
    return <ShowLoadingState />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-4 w-full border rounded-md max-h-[80vh] overflow-y-auto p-2">
        {/* Personal Information */}
        <fieldset className="space-y-4 border p-4 rounded-md">
          <legend className="text-sm font-semibold -mb-1.5">
            Personal Information
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithLabel
              name="firstName"
              fieldTitle="First Name"
              placeholder="Enter first name"
              schema={StaffSchema}
            />
            <InputWithLabel
              name="lastName"
              fieldTitle="Last Name"
              placeholder="Enter last name"
              schema={StaffSchema}
            />
            <InputWithLabel
              name="middleName"
              fieldTitle="Middle Name (Optional)"
              placeholder="Enter middle name"
              schema={StaffSchema}
            />
            <InputWithLabel
              name="employeeId"
              fieldTitle="Employee ID"
              placeholder="Enter employee ID"
              schema={StaffSchema}
            />
            <DatePickerWithLabel
              name="birthDate"
              fieldTitle="Date of Birth"
              schema={StaffSchema}
            />
            <SelectWithLabel
              name="gender"
              fieldTitle="Gender"
              placeholder="Select gender"
              data={[
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ]}
              schema={StaffSchema}
            />
            <SelectWithLabel
              name="maritalStatus"
              fieldTitle="Marital Status"
              placeholder="Select marital status"
              data={[
                { value: "Single", label: "Single" },
                { value: "Married", label: "Married" },
                { value: "Divorced", label: "Divorced" },
                { value: "Widowed", label: "Widowed" },
              ]}
              schema={StaffSchema}
            />
            <InputWithLabel
              name="phone"
              fieldTitle="Phone Number"
              placeholder="Enter phone number"
              schema={StaffSchema}
            />
          </div>
        </fieldset>

        {/* Academic Information */}
        <fieldset className="space-y-4 border p-4 rounded-md">
          <legend className="text-sm font-semibold -mb-1.5">
            Academic & Employment Information
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectWithLabel
              name="staffType"
              fieldTitle="Staff Type"
              data={STAFF_TYPE.map((type) => ({
                label: type.split("_").join(" "),
                value: type,
              }))}
              valueKey="value"
              selectedKey="label"
              placeholder="Select staff type"
              schema={StaffSchema}
            />
            <SelectWithLabel
              name="staffCategory"
              fieldTitle="Staff Category "
              data={STAFF_CATEGORY.map((type) => ({
                label: type.split("_").join(" "),
                value: type,
              }))}
              valueKey="value"
              selectedKey="label"
              placeholder="Select staff category"
              schema={StaffSchema}
            />
            <SelectWithLabel
              name="rank"
              fieldTitle="Current Rank"
              placeholder="Select rank"
              data={
                staffType === "Teaching" ? RANKS.teaching : RANKS.administrative
              }
              schema={StaffSchema}
              className="line-clamp-1 inline-flex"
            />
            <DatePickerWithLabel
              name="dateOfFirstAppointment"
              fieldTitle="Date of First Appointment"
              schema={StaffSchema}
            />
            <InputWithLabel
              name="academicQual"
              fieldTitle="Academic Qualification"
              placeholder="Enter academic qualification"
              schema={StaffSchema}
            />
            <InputWithLabel
              name="ssnitNumber"
              fieldTitle="SSNIT Number"
              placeholder="Enter SSNIT number"
              schema={StaffSchema}
            />
            <div
              className={cn(
                (!staffType || staffType === "Non_Teaching") && "md:col-span-2",
              )}>
              <InputWithLabel
                name="ghcardNumber"
                fieldTitle="Ghana Card Number"
                placeholder="Enter Ghana Card number"
                schema={StaffSchema}
                className="max-w-4xl"
              />
            </div>
            {staffType === "Teaching" && (
              <>
                <InputWithLabel
                  name="rgNumber"
                  fieldTitle="Registration Number"
                  placeholder="Enter registration number"
                  schema={StaffSchema}
                />
                <div className="md:col-span-2">
                  <InputWithLabel
                    name="licencedNumber"
                    fieldTitle="License Number"
                    placeholder="Enter license number"
                    schema={StaffSchema}
                    className="max-w-4xl"
                  />
                </div>
              </>
            )}
          </div>
        </fieldset>

        {/* Department Information */}
        {staffType === "Teaching" && (
          <fieldset className="space-y-4 border p-4 rounded-md">
            <legend className="text-sm font-semibold">
              Department & Assignments
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SelectWithLabel
                name="departmentId"
                fieldTitle="Department"
                placeholder="Select department"
                data={departments}
                schema={StaffSchema}
                selectedKey="name"
                valueKey="id"
              />
              <FormField
                control={form.control}
                name="isDepartmentHead"
                render={({ field }) => (
                  <div className="flex items-center space-x-2 pt-8">
                    <Checkbox
                      id="isDepartmentHead"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <Label htmlFor="isDepartmentHead">Department Head</Label>
                  </div>
                )}
              />
            </div>

            <MultiSelectCombox
              name="courses"
              fieldTitle="Assigned Courses"
              placeholder="--- Select courses ---"
              data={courses}
              schema={StaffSchema}
              valueKey="id"
              selectedKey="title"
            />
            <MultiSelectCombox
              name="classes"
              fieldTitle="Assigned Classes"
              placeholder="--- Select classes ---"
              data={classes}
              schema={StaffSchema}
              valueKey="id"
              selectedKey="name"
            />
          </fieldset>
        )}

        {/* Account Information */}
        <fieldset className="space-y-4 border p-4 rounded-md">
          <legend className="text-sm font-semibold">Account Information</legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputWithLabel
              name="email"
              fieldTitle="Email Address"
              placeholder="Enter email address"
              type="email"
              schema={StaffSchema}
              disabled={!!id}
            />
            <InputWithLabel
              name="username"
              fieldTitle="Username"
              placeholder="Enter username"
              schema={StaffSchema}
              disabled={!!id}
            />
          </div>
        </fieldset>

        {/* Profile Picture */}
        <fieldset className="space-y-4 border p-4 rounded-md">
          <legend className="text-sm font-semibold">Profile Picture</legend>
          <FileUploadInput
            name="imageFile"
            fieldTitle="Upload Profile Picture"
            photoURL={defaultValues?.imageURL as string}
            isEditing={!!id}
          />
        </fieldset>

        {/* Action Buttons */}
        <div className="flex flex-col-reverse gap-2 md:flex-row md:justify-center space-x-4 pt-6 border-t">
          <LoadingButton
            className="md:w-[25%]"
            type="submit"
            loading={isPending}>
            {id ? "Update Staff" : "Create Staff"}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
