import { useForm, useWatch } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
import {
  STAFF_CATEGORY,
  STAFF_TYPE,
  StaffSchema,
  StaffType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import { useEffect, useState } from "react";
import { getServerSideProps } from "@/app/(private)/(admin)/admin/departments/actions/getServerSideProps";
import {
  ClassesResponseType,
  CourseResponseType,
  DepartmentResponseType,
  StaffResponseType,
} from "@/lib/types";
import { toast } from "sonner";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import { getCourses } from "../../../courses/actions/actions";
import { getClassesAction } from "../../../classes/actions/server-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import SearchableMultiSelect from "@/components/customComponents/SearchableMultiSelect";
import FileUploadInput from "@/components/customComponents/FileUploadInput";
import { RANKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type CreateStaffProps = {
  onSubmit: (data: StaffType) => Promise<void>;
  id?: string;
  defaultValues?: StaffType;
  onDelete?: () => void;
  isDeletePending?: boolean;
  isPending?: boolean;
};

export default function CreateStaffForm({
  onSubmit,
  id,
  defaultValues,
  onDelete,
  isDeletePending,
  isPending,
}: CreateStaffProps) {
  const form = useForm<StaffType>({
    resolver: zodResolver(StaffSchema),
    defaultValues: {
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
      ...defaultValues,
    },
  });

  const [departments, setDepartments] = useState<DepartmentResponseType[]>([]);
  const [courses, setCourses] = useState<CourseResponseType[]>([]);
  const [classes, setClasses] = useState<ClassesResponseType[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await getServerSideProps();
        if (res.error) {
          toast.error(res.error);
          return;
        }
        setDepartments(res.departments || []);
      } catch (error) {
        toast.error("Failed to fetch departments");
      } finally {
        setIsLoadingDepartments(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        if (res.error) {
          toast.error(res.error);
          return;
        }
        setCourses(res.courses || []);
      } catch (error) {
        toast.error("Failed to fetch courses");
      } finally {
        setIsLoadingCourses(false);
      }
    };

    const fetchClasses = async () => {
      try {
        const res = await getClassesAction();
        if (res.error) {
          toast.error(res.error);
          return;
        }
        setClasses(res.data || []);
      } catch (error) {
        toast.error("Failed to fetch classes");
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchDepartments();
    fetchCourses();
    fetchClasses();
  }, []);

  const handleSubmit = (data: StaffType) => {
    onSubmit(data);
  };

  const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete(
    "Delete Staff",
    "Are you sure you want to delete this staff member?"
  );

  const staffType = useWatch({
    control: form.control,
    name: "staffType",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 max-h-[80vh] overflow-y-auto p-2">
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
                (!staffType || staffType === "Non_Teaching") && "md:col-span-2"
              )}>
              <InputWithLabel
                name="ghcardNumber"
                fieldTitle="Ghana Card Number"
                placeholder="Enter Ghana Card number"
                schema={StaffSchema}
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
                data={departments.map((dept) => ({
                  value: dept.id,
                  label: dept.name,
                }))}
                schema={StaffSchema}
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

            <SearchableMultiSelect
              name="courses"
              fieldTitle="Assigned Courses"
              placeholder="Select courses"
              data={courses.map((course) => ({
                id: course.id,
                name: `${course.code} - ${course.title}`,
              }))}
              schema={StaffSchema}
            />
            <SearchableMultiSelect
              name="classes"
              fieldTitle="Assigned Classes"
              placeholder="Select classes"
              data={classes.map((cls) => ({
                id: cls.id,
                name: `${cls.name} (${cls.level})`,
              }))}
              schema={StaffSchema}
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
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {id && onDelete && (
            <LoadingButton
              loading={isDeletePending as boolean}
              type="button"
              variant="destructive"
              onClick={async () => {
                const ok = await confirmDelete();
                ok && onDelete();
              }}>
              Delete Staff
            </LoadingButton>
          )}
          <LoadingButton type="submit" loading={isPending as boolean}>
            {id ? "Update Staff" : "Create Staff"}
          </LoadingButton>
        </div>
      </form>
      <ConfirmDeleteComponent />
    </Form>
  );
}
