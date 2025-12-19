import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import { useFetchAllPermissions } from "../_hooks/use-fetch-all-permissions";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import LoadingState from "@/components/customComponents/Loading";
import CheckboxWithArrayValues from "@/components/customComponents/CheckboxWithValues";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Plus, Save } from "lucide-react";
import {
  UserPermissionsFormSchema,
  UserPermissionsFormType,
} from "@/lib/validation";

type FormSubmitSchema = {
  onSubmit: (data: UserPermissionsFormType) => void;
  isPending?: boolean;
  id?: string;
  defaultValues?: UserPermissionsFormType;
};

export const UpdateUserPermissionsForm = ({
  onSubmit,
  isPending,
  id,
  defaultValues,
}: FormSubmitSchema) => {
  const form = useForm<UserPermissionsFormType>({
    resolver: zodResolver(UserPermissionsFormSchema),
    mode: "onBlur",
    defaultValues: defaultValues
      ? defaultValues
      : {
          userId: "",
          username: "",
          permissions: [],
        },
  });

  const { success, fetchError, isFetching, permissions } =
    useFetchAllPermissions();

  const handleSubmit = (data: UserPermissionsFormType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 rounded-md border">
        <div className="sr-only">
          <InputWithLabel
            name="userId"
            fieldTitle="UserId"
            schema={UserPermissionsFormSchema}
            disabled={!!id}
          />
        </div>
        <InputWithLabel
          name="username"
          fieldTitle="Username"
          schema={UserPermissionsFormSchema}
          disabled={!!id}
        />

        {fetchError ? (
          <ErrorComponent error={fetchError} />
        ) : isFetching ? (
          <span>Loading Permissions...</span>
        ) : (
          <div className="w-full ">
            {permissions && permissions.length > 0 && (
              <CheckboxWithArrayValues
                name="permissions"
                fieldTitle="Permissions"
                schema={UserPermissionsFormSchema}
                data={permissions}
                valueKey="id"
                labelKey="name"
                className="grid grid-cols-2 gap-3 w-full"
              />
            )}
          </div>
        )}

        <LoadingButton loading={isPending as boolean}>
          {id ? (
            <>
              <Save />
              {isPending ? "Saving Persissions..." : "Save Permissions"}
            </>
          ) : (
            <>
              <Plus />
              {isPending ? "Creating Permissions" : "Create Permissions"}
            </>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
