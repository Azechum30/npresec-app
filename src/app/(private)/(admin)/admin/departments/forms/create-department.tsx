/** biome-ignore-all assist/source/organizeImports: reason */
"use client";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { DepartmentSchema, type DepartmentType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, Save } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { staffQueryOptions } from "../../staff/actions/queries";

type CreateDepartmentProps = {
  id?: string;
  onSubmitAction: (data: DepartmentType) => Promise<void>;
  defaultValues?: DepartmentType;
  isPending: boolean;
};

export default function CreateDepartment({
  isPending,
  id,
  defaultValues,
  onSubmitAction,
}: CreateDepartmentProps) {
  const form = useForm<DepartmentType>({
    resolver: zodResolver(DepartmentSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          code: "",
          headId: undefined,
          name: "",
          description: "",
          createdAt: undefined,
        },
  });
  const { dialogs } = useGenericDialog();
  const isOpen = !!dialogs["create-department"] || !!dialogs["edit-department"];

  const { data } = useQuery({
    ...staffQueryOptions,
    enabled: isOpen,
  });

  const staff = useMemo(() => {
    if (!data) return [];
    return data
      .filter((st) => st.staffType === "Teaching")
      .map((st) => ({
        id: st.id,
        fullName: `${st.lastName} ${st.firstName} ${st.middleName}`,
      }));
  }, [data]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitAction)}
        className="space-y-4 border rounded-md max-h-[80dvh] overflow-auto p-4">
        <InputWithLabel
          name="name"
          fieldTitle="Name"
          disabled={!!id}
          schema={DepartmentSchema}
        />
        <InputWithLabel
          name="code"
          fieldTitle="Department Code"
          disabled={!!id}
          schema={DepartmentSchema}
        />

        {data && data.length > 0 && (
          <SelectWithLabel
            name="headId"
            fieldTitle="Department Head"
            data={staff}
            valueKey="id"
            selectedKey="fullName"
            placeholder="--Select HOD--"
          />
        )}
        <TextAreaWithLabel name="description" fieldTitle="Description" />
        <DatePickerWithLabel
          name="createdAt"
          fieldTitle="CreatedAt"
          schema={DepartmentSchema}
          startDate={new Date().getFullYear() - 14}
          endDate={new Date().getFullYear()}
          disableFutureDates={true}
        />
        <div className="flex flex-col gap-y-3">
          <LoadingButton loading={isPending}>
            {id ? (
              <>
                <Save className="size-5" /> Save
              </>
            ) : (
              <>
                <PlusCircle className="size-5" /> Create{" "}
              </>
            )}
          </LoadingButton>
        </div>
      </form>
    </Form>
  );
}
