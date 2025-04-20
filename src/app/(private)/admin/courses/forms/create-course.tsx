import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { Form } from "@/components/ui/form";
import {
  ClassesResponseType,
  CourseResponseType,
  DepartmentResponseType,
  TeacherResponseType,
} from "@/lib/types";
import { CoursesSchema, CoursesType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { getServerSideProps } from "../../departments/actions/getServerSideProps";
import { getTeachers } from "../../teachers/actions/server";
import { getClassesAction } from "../../classes/actions/server-actions";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import CheckboxWithArrayValues from "@/components/customComponents/CheckboxWithValues";

type CreateCoursProps = {
  onSubmit: (data: CoursesType) => Promise<CourseResponseType | undefined>;
  defaultValues?: CoursesType;
  onDelete?: () => Promise<void>;
  id?: string;
  isDeletePending?: boolean;
};

const CreateCourseForm: React.FC<CreateCoursProps> = ({
  onSubmit,
  onDelete,
  defaultValues,
  id,
  isDeletePending,
}) => {
  const form = useForm<CoursesType>({
    resolver: zodResolver(CoursesSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          code: "",
          title: "",
          description: "",
          credits: 0,
          departments: [],
          teachers: [],
          classes: [],
          createdAt: undefined,
        },
  });

  const [departments, setDepartments] = React.useState<
    DepartmentResponseType[] | undefined
  >();
  const [teachers, setTeachers] = React.useState<
    Array<TeacherResponseType> | undefined
  >();
  const [classes, setClasses] = React.useState<
    Array<ClassesResponseType> | undefined
  >();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const { confirmDelete, ConfirmDeleteComponent } = useConfirmDelete();

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const [departments, teachers, classes] = await Promise.all([
        getServerSideProps(),
        getTeachers(),
        getClassesAction(),
      ]);

      if (departments.error) {
        setError(departments.error);
        setIsLoading(false);
      } else if (teachers.error) {
        setError(teachers.error);
        setIsLoading(false);
      } else if (classes.error) {
        setError(classes.error);
        setIsLoading(false);
      } else {
        setDepartments(departments.departments);
        setTeachers(() => {
          const newArray = teachers.teachers?.map((tr) => ({
            ...tr,
            fullname: `${tr.lastName} ${tr.firstName} ${
              tr.middleName && tr.middleName
            }`,
          }));
          return newArray;
        });
        setClasses(classes.data);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const [isPending, startTransition] = React.useTransition();

  const handleSubmit = async (data: CoursesType) => {
    startTransition(async () => {
      const resp = await onSubmit(data);
    });
  };

  return (
    <>
      <ConfirmDeleteComponent />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 w-full h-full text-left rounded-md border p-4 overflow-auto">
          <InputWithLabel<CoursesType>
            name="code"
            fieldTitle="Course Code"
            placeholder="e.g. MATH101"
            disabled={!!id}
            schema={CoursesSchema}
          />
          <InputWithLabel<CoursesType>
            name="title"
            fieldTitle="Course Title"
            placeholder="e.g. Mathematics"
            schema={CoursesSchema}
          />
          <InputWithLabel<CoursesType>
            name="credits"
            fieldTitle="Course Credits"
            type="number"
            min={0}
            placeholder="e.g. 2 or 3 or 5"
            schema={CoursesSchema}
          />
          <DatePickerWithLabel<CoursesType>
            name="createdAt"
            fieldTitle="Created Date"
            schema={CoursesSchema}
          />

          {departments !== undefined && departments.length > 0 && (
            <CheckboxWithArrayValues<CoursesType>
              name="departments"
              fieldTitle="Select the streams that run the Course"
              data={departments}
              valueKey="id"
              labelKey="name"
              schema={CoursesSchema}
            />
          )}

          {classes !== undefined && classes.length > 0 && (
            <CheckboxWithArrayValues<CoursesType>
              name="classes"
              fieldTitle="Select the classes that offer this Course"
              data={classes}
              valueKey="id"
              labelKey="name"
              schema={CoursesSchema}
            />
          )}
          {teachers !== undefined && teachers.length > 0 && (
            <CheckboxWithArrayValues<CoursesType>
              name="teachers"
              fieldTitle="Select the teachers who teach this Course"
              data={teachers}
              valueKey="id"
              labelKey="fullname"
              schema={CoursesSchema}
            />
          )}
          <TextAreaWithLabel<CoursesType>
            name="description"
            fieldTitle="Course Descritpion"
            placeholder="e.g. This course is about..."
          />
          <div className="flex flex-col gap-4">
            <LoadingButton loading={isPending} type="submit">
              {id
                ? isPending
                  ? "Saving..."
                  : "Save"
                : isPending
                ? "Creating..."
                : "Create"}
            </LoadingButton>
          </div>
          {id && (
            <LoadingButton
              loading={isDeletePending as boolean}
              type="button"
              variant="destructive"
              onClick={async () => {
                const ok = await confirmDelete();
                if (ok) await onDelete?.();
              }}>
              {isDeletePending ? "Deleting..." : "Delete"}
            </LoadingButton>
          )}
        </form>
      </Form>
    </>
  );
};

export default CreateCourseForm;
