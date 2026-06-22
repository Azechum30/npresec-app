/**biome-ignore-all assist/source/organizeImports: reason */
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { Form } from "@/components/ui/form";
import { CoursesSchema, type CoursesType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { Plus, Save } from "lucide-react";
import { useMemo, type FC } from "react";
import { useForm, useWatch } from "react-hook-form";
import { classQueryOptions } from "../../classes/actions/queries";
import { departmentsQueryOptions } from "../../departments/actions/queries";
import { staffQueryOptions } from "../../staff/actions/queries";

type CreateCoursProps = {
  onSubmitAction: (data: CoursesType) => Promise<void>;
  isPending: boolean;
  defaultValues?: CoursesType;
  id?: string;
};

const CreateCourseForm: FC<CreateCoursProps> = ({
  onSubmitAction,
  isPending,
  defaultValues,
  id,
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
          staff: [],
          classes: [],
          createdAt: new Date(),
        },
  });

  const departmentIds = useWatch({
    control: form.control,
    name: "departments",
  });

  const [departmentsQueryData, staffQueryData, classesQueryData] = useQueries({
    queries: [departmentsQueryOptions, staffQueryOptions, classQueryOptions],
  });

  const departments = useMemo(() => {
    if (!departmentsQueryData.data) return [];

    return departmentsQueryData.data.map((dp) => ({
      id: dp.id,
      name: dp.name,
    }));
  }, [departmentsQueryData.data]);

  const staff = useMemo(() => {
    if (!staffQueryData.data) return [];

    return staffQueryData.data
      .filter((st) => st.staffType === "Teaching")
      .map((st) => ({
        id: st.id,
        name: `${st.lastName} ${st.firstName} ${st.middleName}`,
      }));
  }, [staffQueryData.data]);

  const classes = useMemo(() => {
    if (!departmentIds || !classesQueryData.data) return [];
    return classesQueryData.data
      .filter((cls) => departmentIds.includes(cls.departmentId as string))
      .map((cls) => ({
        id: cls.id,
        name: `${cls.name} (${cls.level.replace(/_/g, " ")})`,
      }));
  }, [departmentIds, classesQueryData.data]);

  const isLoading =
    departmentsQueryData.isLoading ||
    staffQueryData.isLoading ||
    classesQueryData.isLoading;

  if (isLoading) {
    return <ShowLoadingState />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-4 w-full h-[80vh] text-left rounded-md border p-4 overflow-auto">
        <InputWithLabel
          name="code"
          fieldTitle="Course Code"
          placeholder="e.g. Math101, Eng101 (optional)"
          disabled={!!id}
          schema={CoursesSchema}
        />
        <InputWithLabel
          name="title"
          fieldTitle="Course Title"
          placeholder="e.g. Mathematics"
          schema={CoursesSchema}
        />
        <InputWithLabel
          name="credits"
          fieldTitle="Course Credits"
          type="number"
          min={0}
          placeholder="e.g. 2 or 3 or 5"
          schema={CoursesSchema}
        />
        <DatePickerWithLabel
          name="createdAt"
          fieldTitle="Created Date"
          schema={CoursesSchema}
          startDate={1990}
          endDate={new Date().getFullYear()}
        />

        {departments !== undefined && departments.length > 0 && (
          <MultiSelectCombox
            name="departments"
            fieldTitle="Select the streams that run the Course"
            data={departments}
            valueKey="id"
            selectedKey="name"
            schema={CoursesSchema}
            placeholder="Select departments"
          />
        )}

        {classes !== undefined && classes.length > 0 && (
          <MultiSelectCombox
            name="classes"
            fieldTitle="Select the classes that offer this Course"
            data={classes}
            valueKey="id"
            selectedKey="name"
            schema={CoursesSchema}
            placeholder="--- Select clasess ---"
          />
        )}
        {staff && staff.length > 0 && (
          <MultiSelectCombox
            name="staff"
            fieldTitle="Select the teachers who teach this Course"
            data={staff}
            valueKey="id"
            selectedKey="name"
            schema={CoursesSchema}
            placeholder="Select staff"
          />
        )}
        <TextAreaWithLabel
          name="description"
          fieldTitle="Course Descritpion"
          placeholder="e.g. This course is about..."
        />
        <div className="flex flex-col gap-4">
          <LoadingButton loading={isPending} type="submit">
            {id ? (
              isPending ? (
                "Saving..."
              ) : (
                <>
                  <Save /> Save
                </>
              )
            ) : isPending ? (
              "Creating..."
            ) : (
              <>
                <Plus />
                Create
              </>
            )}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourseForm;
