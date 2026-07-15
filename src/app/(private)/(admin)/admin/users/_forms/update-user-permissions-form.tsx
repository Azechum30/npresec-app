/** biome-ignore-all assist/source/organizeImports: reason */
import CheckboxWithArrayValues from "@/components/customComponents/CheckboxWithValues";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import { Form } from "@/components/ui/form";
import type { PermissionResponseType, RolesResponseType } from "@/lib/types";
import {
  UserPermissionsFormSchema,
  type UserPermissionsFormType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Save } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

type FormSubmitSchema = {
  onSubmit: (data: UserPermissionsFormType) => void;
  roles: RolesResponseType[];
  permissions: PermissionResponseType[];
  isPending?: boolean;
  id?: string;
  defaultValues?: UserPermissionsFormType;
};

export const UpdateUserPermissionsForm = ({
  onSubmit,
  roles,
  permissions,
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

  const selectedRoles = useWatch({
    control: form.control,
    name: "roleId",
  });

  const permissionsForSelectedRoles = useMemo(() => {
    if (!selectedRoles || selectedRoles.length === 0) return [];
    return permissions.filter((p) =>
      p.roles.some((roleRelation) => selectedRoles.includes(roleRelation.id)),
    );
  }, [permissions, selectedRoles]);

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
          />
        </fieldset>

        <MultiSelectCombox
          name="permissions"
          fieldTitle="Permissions"
          schema={UserPermissionsFormSchema}
          data={permissionsForSelectedRoles}
          valueKey="id"
          selectedKey="name"
        />

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
