"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { DepartmentType, DepartmentSchema } from "@/lib/validation";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { useEffect, useState, useTransition } from "react";
import { useConfirmDelete } from "@/components/customComponents/useConfirmDelete";
import DatePickerWithLabel from "@/components/customComponents/DatePickerWithLabel";
import { StaffResponseType } from "@/lib/types";
import { getStaff } from "../../staff/actions/server";
import { toast } from "sonner";

type onDeleteResponseType = Promise<
  | {
      name: string;
      code: string;
      description: string | null;
      headId: string | null;
      id: string;
      createdAt: Date;
    }
  | {
      error: string;
    }
  | string
  | number
  | undefined
>;

type CreateDepartmentProps = {
  id?: string;
  onSubmit: (data: DepartmentType) => void;
  onDelete?: (id: string) => Promise<void>;
  defaultValues?: DepartmentType;
};

export default function CreateDepartment({
  id,
  defaultValues,
  onSubmit,
  onDelete,
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

  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const { ConfirmDeleteComponent, confirmDelete } = useConfirmDelete();
  const [teachers, setTeachers] = useState<StaffResponseType[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      const res = await getStaff();
      if (res.error) {
        return toast.error(res.error);
      }
      if (res.staff === undefined) return;
      setTeachers((prev) => {
        const newArray = res.staff?.map((st) => ({
          ...st,
          firstName: `${st.lastName} ${st.firstName} ${
            st.middleName ? st.middleName : ""
          }`,
        }));
        return newArray;
      });
    };

    fetchTeachers();
  }, []);

  async function handleSubmit(values: DepartmentType) {
    startTransition(async () => {
      await onSubmit(values);
    });
  }

  async function handleDelete(id: string) {
    startDeleteTransition(async () => {
      await onDelete?.(id);
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 h-full overflow-auto p-4">
        <ConfirmDeleteComponent />
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

        {teachers && teachers.length > 0 && (
          <SelectWithLabel
            name="headId"
            fieldTitle="Department Head"
            data={teachers}
            valueKey="id"
            selectedKey="firstName"
            placeholder="--Select HOD--"
          />
        )}

        <TextAreaWithLabel name="description" fieldTitle="Description" />
        <DatePickerWithLabel
          name="createdAt"
          fieldTitle="CreatedAt"
          schema={DepartmentSchema}
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
          {id && (
            <LoadingButton
              loading={isDeletePending}
              variant="destructive"
              type="button"
              onClick={async () => {
                const ok = await confirmDelete();
                if (ok) {
                  await handleDelete(id);
                }
              }}>
              <Trash2 className="size-4 mr-1" /> Delete{" "}
            </LoadingButton>
          )}
        </div>
      </form>
    </Form>
  );
}
