"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import TextAreaWithLabel from "@/components/customComponents/TextareaWithLabel";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PermissionSchema, PermissionType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, PlusCircle, Save, Trash2, X } from "lucide-react";
import { FC } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type CreatePermissionFormProps = {
  onSubmit: (data: PermissionType) => void;
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

  const handlePermissionCreation = (values: PermissionType) => {
    onSubmit(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePermissionCreation)}
          className="space-y-4 p-4 border max-h-[80vh] overflow-auto">
          {fields.map((field, index) => (
            <div
              key={`${field.id}-${index}`}
              className="flex flex-col gap-4 items-baseline border rounded-md p-2">
              <div className="w-full">
                <InputWithLabel
                  name={`permissions.${index}.name` as const}
                  fieldTitle={`Permission-${index + 1}-name`}
                  placeholder="example - action:resource"
                  className="w-full"
                />
              </div>

              <div className="w-full">
                <TextAreaWithLabel
                  name={`permissions.${index}.description` as const}
                  fieldTitle={`Permission-${index + 1}-description`}
                  placeholder="Description"
                />
              </div>
              {!id && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={fields.length === 1}
                  className="w-full"
                  onClick={() => remove(index)}>
                  <Trash2 className="size-5" />
                  Remove
                </Button>
              )}
            </div>
          ))}
          <div className="flex flex-col gap-4">
            {!id && (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => append({ name: "", description: "" })}>
                <Plus className="size-5" />
                Add Permission
              </Button>
            )}
            <LoadingButton loading={isPending as boolean} className="w-auto">
              {id ? (
                <>
                  <Save className="size-5" />
                  {isPending ? "Updating..." : "Update Permission"}
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
