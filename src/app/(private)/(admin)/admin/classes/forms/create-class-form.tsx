import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClassesResponseType,
  DepartmentResponseType,
  StaffResponseType,
} from "@/lib/types";
import { ClassesSchema, ClassesType, grades } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { getServerSideProps } from "../../departments/actions/getServerSideProps";
import TagsComponent from "@/components/customComponents/TagsComponent";
import { getStaff } from "../../staff/actions/server";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { PlusCircle, Save, Trash } from "lucide-react";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";

type onSubmitFormResponse = ClassesResponseType | { errors?: {} } | undefined;

type CreateClassFormProps = {
  onSubmit: (data: ClassesType) => Promise<onSubmitFormResponse>;
  id?: string;
  defaultValues?: ClassesType;
  onDelete?: () => void;
  isDeletePending?: boolean;
};

const CreateClassForm: FC<CreateClassFormProps> = ({
  onSubmit,
  onDelete,
  id,
  defaultValues,
  isDeletePending,
}) => {
  const form = useForm<ClassesType>({
    resolver: zodResolver(ClassesSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          code: "",
          createdAt: undefined,
          departmentId: undefined,
          maxCapacity: 0,
          name: "",
          level: "" as (typeof grades)[number],
          staff: [] as string[],
        },
  });

  const [departments, setDepartments] = useState<DepartmentResponseType[]>([]);
  const [teachers, setTeachers] = useState<StaffResponseType[]>([]);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDepartments = async () => {
      const [staffs, departments] = await Promise.all([
        getStaff(),
        getServerSideProps(),
      ]);

      if (
        staffs.error ||
        departments.error ||
        departments.departments === undefined ||
        staffs.staff === undefined
      )
        return;

      setDepartments(departments?.departments);
      setTeachers(staffs.staff);
    };

    fetchDepartments();
  }, []);

  const handleSubmit = (data: ClassesType) => {
    startTransition(async () => {
      const res = await onSubmit(data);
      if (res !== undefined && "errors" in res) {
        const errors = res.errors!;

        if ("code" in errors) {
          form.setError("code", {
            type: "validate",
            message: errors.code as string,
          });
        } else if ("name" in errors) {
          form.setError("name", {
            type: "validate",
            message: errors.name as string,
          });
        } else if ("level" in errors) {
          form.setError("level", {
            type: "validate",
            message: errors.level as string,
          });
        } else if ("teachers" in errors) {
          form.setError("staff", {
            type: "validate",
            message: errors.teachers as string,
          });
        } else if ("departmentId" in errors) {
          form.setError("departmentId", {
            type: "validate",
            message: errors.departmentId as string,
          });
        } else if ("createdAt" in errors) {
          form.setError("createdAt", {
            type: "validate",
            message: errors.createdAt as string,
          });
        }
      }
    });
  };

  const handleTeacherChange = (selectedTeachers: StaffResponseType[]) => {
    form.setValue(
      "staff",
      selectedTeachers.map((teacher) => teacher.id)
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full h-[80vh] text-left rounded-md border p-4 overflow-auto">
        <InputWithLabel
          name="name"
          fieldTitle="Class Name"
          disabled={id ? true : false}
          schema={ClassesSchema}
        />
        <InputWithLabel
          name="code"
          fieldTitle="Class Code"
          disabled={id ? true : false}
          schema={ClassesSchema}
        />

        {departments && departments.length > 0 && (
          <SelectWithLabel
            name="departmentId"
            fieldTitle="Associated Department"
            schema={ClassesSchema}
            data={departments}
            valueKey="id"
            selectedKey="name"
            placeholder="--Select department--"
          />
        )}

        <FormField
          name="level"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="level" className="text-sm">
                Year Group
              </FormLabel>
              <Select
                defaultValue={field.value ? field.value : ""}
                onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue
                      placeholder="Select class year group"
                      className="placeholder:text-muted-foreground placeholder:text-sm"
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent position="popper">
                  {grades.map((grade) => (
                    <SelectItem value={grade} key={grade}>
                      {grade.split("_").join(" ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <InputWithLabel
          name="maxCapacity"
          fieldTitle="Maximum Capacity"
          schema={ClassesSchema}
          type="number"
          min={0}
          max={50}
        />

        <DatePickerWithLabel
          name="createdAt"
          fieldTitle="Created Date"
          schema={ClassesSchema}
          startDate={1990}
          endDate={new Date().getFullYear()}
        />

        {teachers && teachers.length > 0 && (
          <FormField
            control={form.control}
            name="staff"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="teachers">Assigned Teachers</FormLabel>
                <FormControl>
                  <TagsComponent
                    value={
                      teachers.filter((teacher) =>
                        field.value?.includes(teacher.id)
                      ) || []
                    }
                    onChange={handleTeacherChange}
                    placeHolder="Search for teachers by first name"
                    name={field.name}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    suggestions={teachers}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <div className="flex flex-col gap-y-3">
          <LoadingButton loading={isPending}>
            {isPending ? (
              id !== undefined ? (
                "Saving"
              ) : (
                "Creating"
              )
            ) : (
              <span className="flex items-center space-x-2">
                {id !== undefined ? (
                  <>
                    <Save className="size-5 mr-2" /> Save
                  </>
                ) : (
                  <>
                    <PlusCircle className="size-5 mr-2" /> Create
                  </>
                )}
              </span>
            )}
          </LoadingButton>

          {!!id && (
            <LoadingButton
              loading={isDeletePending as boolean}
              type="button"
              variant="destructive"
              onClick={() => onDelete?.()}>
              <Trash className="size-5" />
              <span>Delete</span>
            </LoadingButton>
          )}
        </div>
      </form>
    </Form>
  );
};

export default CreateClassForm;
