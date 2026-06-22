/** biome-ignore-all assist/source/organizeImports: reason */
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
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
import { ClassesSchema, type ClassesType, grades } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueries } from "@tanstack/react-query";
import { PlusCircle, Save } from "lucide-react";
import { type FC, useMemo } from "react";
import { useForm } from "react-hook-form";
import { departmentsQueryOptions } from "../../departments/actions/queries";
import { staffQueryOptions } from "../../staff/actions/queries";

// type onSubmitFormResponse = ClassesResponseType | { errors?: {} } | undefined;

type CreateClassFormProps = {
  onSubmitAction: (data: ClassesType) => Promise<void>;
  id?: string;
  defaultValues?: ClassesType;
  isPending: boolean;
};

const CreateClassForm: FC<CreateClassFormProps> = ({
  onSubmitAction,
  isPending,
  id,
  defaultValues,
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

  const [departmentsQueryData, staffQueryData] = useQueries({
    queries: [departmentsQueryOptions, staffQueryOptions],
  });

  const staff = useMemo(() => {
    if (!staffQueryData.data) return [];

    return staffQueryData.data
      .filter((st) => st.staffType === "Teaching")
      .map((st) => ({
        id: st.id,
        fullName: `${st.lastName} ${st.firstName} ${st.middleName}`,
      }));
  }, [staffQueryData.data]);

  const departments = useMemo(() => {
    if (!departmentsQueryData.data) return [];
    return departmentsQueryData.data.map((dp) => ({
      id: dp.id,
      name: dp.name,
    }));
  }, [departmentsQueryData.data]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-4 w-full h-[80vh] text-left rounded-md border p-4 overflow-auto">
        <InputWithLabel
          name="name"
          fieldTitle="Class Name"
          disabled={!!id}
          schema={ClassesSchema}
          placeholder="Enter class name"
        />
        <InputWithLabel
          name="code"
          fieldTitle="Class Code"
          disabled={!!id}
          schema={ClassesSchema}
          placeholder="Enter class code (optional)"
        />

        {departmentsQueryData.data && departmentsQueryData.data.length > 0 && (
          <SelectWithLabel
            name="departmentId"
            fieldTitle="Associated Department"
            schema={ClassesSchema}
            data={departments}
            valueKey="id"
            selectedKey="name"
            placeholder="Select department"
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

        {staffQueryData.data && staffQueryData.data.length > 0 && (
          <>
            <MultiSelectCombox
              name="staff"
              fieldTitle="Assign Staff"
              data={staff}
              valueKey="id"
              selectedKey="fullName"
              placeholder="Select staff assigned to class"
            />

            <SelectWithLabel
              name="classTeacherId"
              data={staff}
              selectedKey="fullName"
              fieldTitle="Form Master"
              valueKey="id"
              schema={ClassesSchema}
              placeholder="Select form master"
            />
          </>
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
        </div>
      </form>
    </Form>
  );
};

export default CreateClassForm;
