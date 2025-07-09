"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PermissionSchema, PermissionType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle, Save, X } from "lucide-react";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type CreatePermissionFormProps = {
  onSubmit: (data: PermissionType) => Promise<void>;
  defaultValues?: PermissionType;
  id?: string;
  isPending?: boolean;
};

export const CreatePermissionForm: FC<CreatePermissionFormProps> = ({
  onSubmit,
  defaultValues,
  id,
  isPending,
}) => {
  const form = useForm<PermissionType>({
    resolver: zodResolver(PermissionSchema),
    defaultValues: defaultValues
      ? defaultValues
      : { permissions: [{ name: "", description: "" }] },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "permissions",
  });

  const handlePermissionCreation = async (values: PermissionType) => {
    console.log("Form submitted with values:", values);
    await onSubmit(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePermissionCreation)}
          className="space-y-4 p-4 border scrollbar-thin">
          {fields.map((field, index) => (
            <div
              key={`${field.id}-${index}`}
              className="flex gap-2 items-baseline border rounded-md p-2">
              <InputWithLabel<PermissionType>
                name={`permissions.${index}.name`}
                fieldTitle={field.name}
                placeholder="Permission Name"
              />

              <InputWithLabel<PermissionType>
                name={`permissions.${index}.description`}
                fieldTitle={field.description as string}
                placeholder="Description"
              />
              <Button
                type="button"
                variant="destructive"
                disabled={fields.length === 1}
                onClick={() => remove(index)}>
                <X className="size-5" />
              </Button>
            </div>
          ))}
          <div className="flex flex-col md:flex-row md:justify-between gap-2 md:items-center">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => append({ name: "", description: "" })}>
              <Plus className="size-5" />
              Add Permission
            </Button>
            <LoadingButton loading={isPending as boolean} className="w-auto">
              {id ? (
                <>
                  <Save className="size-5" />
                  {isPending ? "Updating..." : "Update Permissions"}
                </>
              ) : (
                <>
                  <PlusCircle className="size-5" />
                  {isPending ? "Creating..." : "Submit Permissions"}
                </>
              )}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
};
