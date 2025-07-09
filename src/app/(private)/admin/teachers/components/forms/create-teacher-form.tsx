import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
} from "@/components/ui/form";
import {
  TeacherSchema,
  TeacherType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import { useEffect, useState, useTransition } from "react";
import { getServerSideProps } from "@/app/(private)/admin/departments/actions/getServerSideProps";
import {
  ClassesResponseType,
  CourseResponseType,
  DepartmentResponseType,
  TeacherResponseType,
} from "@/lib/types";
import { toast } from "sonner";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import { getCourses } from "../../../courses/actions/actions";
import { getClassesAction } from "../../../classes/actions/server-actions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import CheckboxWithArrayValues from "@/components/customComponents/CheckboxWithValues";
import FileUploadInput from "@/components/customComponents/FileUploadInput";

type OnSubmitResponseType = Promise<
  TeacherResponseType | { error?: string } | undefined
>;

type CreateTeacherProps = {
  onSubmit: (data: TeacherType) => OnSubmitResponseType;
  id?: string;
  defaultValues?: TeacherType;
  onDelete?: () => void;
  isDeletePending?: boolean;
};

export default function CreateTeacherForm({
  onSubmit,
  id,
  defaultValues,
  onDelete,
  isDeletePending,
}: CreateTeacherProps) {
  const form = useForm<TeacherType>({
    resolver: zodResolver(TeacherSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          firstName: "",
          lastName: "",
          middleName: "",
          birthDate: undefined,
          gender: "",
          rgNumber: "",
          ssnitNumber: "",
          dateOfFirstAppointment: undefined,
          phone: "",
          academicQual: "",
          departmentId: undefined,
          email: "",
          employeeId: "",
          ghcardNumber: "",
          maritalStatus: "",
          rank: "",
          username: "",
          licencedNumber: "",
          classes: [],
          courses: [],
          isDepartmentHead: false,
          imageURL: "",
          imageFile: undefined
        },
  });

  const [departments, setDepartments] = useState<DepartmentResponseType[]>();
  const [courses, setCourses] =
    useState<Pick<CourseResponseType, "id" | "title">[]>();
  const [classes, setClasses] =
    useState<Pick<ClassesResponseType, "id" | "name">[]>();
  const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete();

  useEffect(() => {
    const fetchDepartments = async () => {
      const [departments, courses, classes] = await Promise.all([
        getServerSideProps(),
        getCourses(),
        getClassesAction(),
      ]);

      if (
        departments === undefined ||
        courses === undefined ||
        classes === undefined
      ) {
        return toast.success("Data is being fetched");
      }
      if (departments.error || courses.error || classes.error) {
        return toast.error("An error occurred while trying to fetch data");
      }

      setDepartments(departments.departments);
      setCourses(courses.courses);
      setClasses(classes.data);
    };
    fetchDepartments().then((value) => console.log(value));
  }, []);

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: TeacherType) {
    startTransition(async () => {
      await onSubmit(data);
    });
  }

  return (
    <>
      <ConfirmDeleteComponent />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto">
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <InputWithLabel<TeacherType>
              name="firstName"
              fieldTitle="First Name"
              schema={TeacherSchema}
            />
            <InputWithLabel<TeacherType>
              name="lastName"
              fieldTitle="Last Name"
              schema={TeacherSchema}
            />
          </div>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <InputWithLabel<TeacherType>
              name="middleName"
              fieldTitle="Middle Name"
              schema={TeacherSchema}
            />
            <SelectWithLabel<TeacherType>
              name="gender"
              fieldTitle="Gender"
              data={["Male", "Female"]}
              placeholder="Select gender"
              className="max-w-md"
              schema={TeacherSchema}
            />
          </div>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <DatePickerWithLabel<TeacherType>
              name="birthDate"
              fieldTitle="Date of Birth"
              schema={TeacherSchema}
            />
            <SelectWithLabel<TeacherType>
              name="maritalStatus"
              fieldTitle="Marital Status"
              data={[
                "Married",
                "Single",
                "Divorced",
                "Engaged",
                "Widow",
                "Widower",
              ]}
              placeholder="Select Marital Status"
              className="max-w-md"
              schema={TeacherSchema}
            />
          </div>

          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <InputWithLabel<TeacherType>
              name="email"
              fieldTitle="Email"
              type="email"
              disabled={id !== undefined}
              schema={TeacherSchema}
            />
            <InputWithLabel<TeacherType>
              name="username"
              fieldTitle="Username"
              className="max-w-md"
              disabled={id !== undefined}
              schema={TeacherSchema}
            />
          </div>

          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <InputWithLabel<TeacherType>
              name="phone"
              fieldTitle="Phone Number"
              schema={TeacherSchema}
            />
            <InputWithLabel<TeacherType>
              name="employeeId"
              fieldTitle="Staff ID"
              className="max-w-md"
              schema={TeacherSchema}
            />
          </div>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <InputWithLabel<TeacherType>
              name="academicQual"
              fieldTitle="Academic Qualification"
            />
            <InputWithLabel<TeacherType>
              name="rank"
              fieldTitle="Current GES Rank"
              placeholder="e.g Principal Supt"
              className="max-w-md"
              schema={TeacherSchema}
            />
          </div>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <InputWithLabel<TeacherType>
              name="ssnitNumber"
              fieldTitle="SSNIT Number"
              schema={TeacherSchema}
            />
            <InputWithLabel<TeacherType>
              name="ghcardNumber"
              fieldTitle="GhanaCard Number"
              className="max-w-md"
              schema={TeacherSchema}
            />
          </div>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <DatePickerWithLabel<TeacherType>
              name="dateOfFirstAppointment"
              fieldTitle="Date of First Appointment"
              schema={TeacherSchema}
            />
            <InputWithLabel<TeacherType>
              name="rgNumber"
              fieldTitle="Registered Number"
              className="max-w-md"
              schema={TeacherSchema}
            />
          </div>
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            <InputWithLabel<TeacherType>
              name="licencedNumber"
              fieldTitle="Licenced Number"
              schema={TeacherSchema}
            />

            {departments && departments.length > 0 && (
              <SelectWithLabel<TeacherType>
                name="departmentId"
                fieldTitle="Assigned Department"
                data={departments}
                valueKey="id"
                selectedKey="name"
                placeholder="--Select department--"
              />
            )}
          </div>
            {departments && departments.length > 0 && (
                <div className="flex flex-col gap-y-2 my-4">
                    <FormField
                        control={form.control}
                        name="isDepartmentHead"
                        render={({ field }) => {
                            return (
                                <div className="flex items-center gap-2">
                                    <Checkbox
                                        id="isDepartmentHead"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="rounded-full "
                                    />
                                    <Label
                                        htmlFor="isDepartmentHead"
                                        className="text-sm">
                                        Are you the head of department of your assigned department?
                                    </Label>
                                </div>
                            );
                        }}
                    />
                </div>
            )}
            <FileUploadInput<TeacherType>
                name="imageFile"
                fieldTitle="Profile Picture"
                photoURL={defaultValues?.imageURL as string}
                isEditing={!!id}
            />
          <div className=" w-full grid grid-cols-1 md:grid-cols-2 md:space-x-5 space-y-5 md:space-y-0 ">
            {classes && classes.length > 0 && (
              <CheckboxWithArrayValues<TeacherType>
                name="classes"
                fieldTitle="Assigned Classes"
                data={classes}
                valueKey="id"
                labelKey="name"
              />
            )}

            {courses && courses.length > 0 && (
              <CheckboxWithArrayValues<TeacherType>
                name="courses"
                fieldTitle="Assigned Courses"
                data={courses}
                valueKey="id"
                labelKey="title"
              />
            )}
          </div>

          <div className="grid grid-cols-1 space-y-4">
            <LoadingButton loading={isPending}>
              {!!id ? (
                <>
                  <Save className="size-5" /> {isPending ? "Saving..." : "Save"}{" "}
                </>
              ) : (
                <>
                  <PlusCircle className="size-5" />{" "}
                  {isPending ? "Creating..." : "Create"}{" "}
                </>
              )}
            </LoadingButton>
            {!!id && (
              <LoadingButton
                loading={isDeletePending as boolean}
                type="button"
                variant="destructive"
                onClick={async () => {
                  const ok = await confirmDelete();
                  if (ok) {
                    onDelete?.();
                  }
                }}>
                <Trash2 className="size-5" /> Delete
              </LoadingButton>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
