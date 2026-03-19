import CheckboxWithArrayValues from "@/components/customComponents/CheckboxWithValues";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import { Form } from "@/components/ui/form";
import {
  UserPermissionsFormSchema,
  UserPermissionsFormType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { startTransition, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getUserRolesAction } from "../_actions/get-user-roles";
import { useFetchAllPermissions } from "../_hooks/use-fetch-all-permissions";

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
          roleId: [],
          permissions: [],
        },
  });

  const [roles, setRoles] = useState<
    { id: string; name: string }[] | undefined
  >();

  const { success, fetchError, isFetching, permissions } =
    useFetchAllPermissions();

  useEffect(() => {
    startTransition(async () => {
      const res = await getUserRolesAction(id as string);

      if (res.error) {
        toast.error(res.error);
        return;
      }
      setRoles(res.roles?.map((r) => ({ id: r.role?.id, name: r.role?.name })));
    });
  }, [id]);

  const handleSubmit = (data: UserPermissionsFormType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 rounded-md border max-h-[80vh] overflow-auto">
        <div className="sr-only">
          <InputWithLabel
            name="userId"
            fieldTitle="UserId"
            schema={UserPermissionsFormSchema}
            disabled={!!id}
          />
        </div>

        {roles && roles.length > 0 && permissions && permissions.length > 0 && (
          <fieldset className="border rounded-md p-3">
            <legend className="px-1.5 text-sm">User Assigned Roles</legend>
            <CheckboxWithArrayValues
              name="roleId"
              fieldTitle="Roles"
              schema={UserPermissionsFormSchema}
              data={roles}
              valueKey="id"
              labelKey="name"
              className="space-y-2"
              disabled={!!id}
            />
          </fieldset>
        )}

        {fetchError ? (
          <ErrorComponent error={fetchError} />
        ) : isFetching ? (
          <span className="block animate-pulse bg-gradient-to-r from-primary/10 to-muted-foreground/10 rounded-md border p-1.5">
            Loading Permissions...
          </span>
        ) : (
          <>
            <div className="w-full ">
              {permissions && permissions.length > 0 && (
                <MultiSelectCombox
                  name="permissions"
                  fieldTitle="Permissions"
                  schema={UserPermissionsFormSchema}
                  data={permissions}
                  valueKey="id"
                  selectedKey="name"
                />
              )}
            </div>
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
          </>
        )}
      </form>
    </Form>
  );
};
