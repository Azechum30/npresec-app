/** biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { GenericSelectWithLabel } from "@/components/customComponents/generic-select-with-label";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import { Form } from "@/components/ui/form";
import type { RolesResponseType } from "@/lib/types";
import type { UserRoleUpdateType } from "@/lib/validation";
import { Plus, SaveIcon } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

type FormProps = {
  onSubmit: (data: UserRoleUpdateType) => void;
  isPending?: boolean;
  id?: string;
  defaultValues?: UserRoleUpdateType;
  roles: RolesResponseType[];
};

export const UpdateUserRoleForm = ({
  onSubmit,
  roles,
  isPending,
  id,
  defaultValues,
}: FormProps) => {
  const form = useForm<UserRoleUpdateType>({
    mode: "onBlur",
    defaultValues: defaultValues
      ? defaultValues
      : {
          roleType: "",
          userId: "",
          roleId: [],
        },
  });

  const selectedRoleType = useWatch({
    control: form.control,
    name: "roleType",
  });

  const handleSubmit = (data: UserRoleUpdateType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 rounded-md border">
        <div className="sr-only">
          <InputWithLabel name="userId" fieldTitle="UserId" disabled={!!id} />
        </div>

        <GenericSelectWithLabel
          name="roleType"
          fieldTitle="Role Category"
          data={["Auth", "Organizational"].map((r) => ({
            id: r,
            name: r,
          }))}
          selectedKey="name"
          valueKey="id"
          className="space-y-2"
        />
        {selectedRoleType && selectedRoleType === "Auth" ? (
          <GenericSelectWithLabel
            name="roleId"
            fieldTitle="Role"
            data={["admin", "user"].map((r) => ({ id: r, name: r }))}
            selectedKey="name"
            valueKey="id"
            className="space-y-2"
          />
        ) : (
          <MultiSelectCombox
            name="roleId"
            fieldTitle="Roles"
            data={roles.flatMap((rs) => ({
              ...rs,
              name: rs.name.split("_").join(" "),
            }))}
            selectedKey="name"
            valueKey="id"
            className="space-y-2"
          />
        )}

        <LoadingButton loading={isPending as boolean}>
          {id ? (
            isPending ? (
              <>
                <SaveIcon />
                Updating Role...
              </>
            ) : (
              <>
                <SaveIcon />
                Update Role
              </>
            )
          ) : isPending ? (
            <>
              <Plus />
              Creating Role...
            </>
          ) : (
            <>
              <Plus />
              Create Role
            </>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
