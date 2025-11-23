"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { UserRoleUpdateType } from "@/lib/validation";
import { Plus, SaveIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { getRolesAction } from "../_actions/get-roles";
import { toast } from "sonner";

type FormProps = {
  onSubmit: (data: UserRoleUpdateType) => void;
  isPending?: boolean;
  id?: string;
  defaultValues?: UserRoleUpdateType;
};

export const UpdateUserRoleForm = ({
  onSubmit,
  isPending,
  id,
  defaultValues,
}: FormProps) => {
  const form = useForm<UserRoleUpdateType>({
    mode: "onBlur",
    defaultValues: defaultValues
      ? defaultValues
      : {
          userId: "",
          roleId: "",
        },
  });

  const [isFetchingRolePending, startTransition] = useTransition();
  const [roles, setRoles] = useState<
    { id: string; name: string }[] | undefined
  >();

  useEffect(() => {
    startTransition(async () => {
      const roles = await getRolesAction();

      if (roles.error) {
        toast.error(roles.error);
      } else {
        setRoles(roles.roles);
      }
    });
  }, []);

  const handleSubmit = (data: UserRoleUpdateType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 p-4 rounded-md border">
        <div className="sr-only">
          <InputWithLabel<UserRoleUpdateType>
            name="userId"
            fieldTitle="UserId"
            disabled={!!id}
          />
        </div>

        {isFetchingRolePending ? (
          <div>Fetching Roles...</div>
        ) : (
          <SelectWithLabel<UserRoleUpdateType>
            name="roleId"
            fieldTitle={id ? "Update Role" : "Role"}
            disabled={isPending}
            data={roles ?? []}
            valueKey="id"
            selectedKey="name"
            placeholder="Select Role"
          />
        )}

        {!isFetchingRolePending && (
          <LoadingButton loading={isPending as boolean}>
            {id ? (
              <>
                {isPending ? (
                  <>
                    <SaveIcon />
                    Updating Role...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Update Role
                  </>
                )}
              </>
            ) : (
              <>
                {isPending ? (
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
              </>
            )}
          </LoadingButton>
        )}
      </form>
    </Form>
  );
};
