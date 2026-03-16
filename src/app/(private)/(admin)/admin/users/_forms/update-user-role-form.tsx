"use client";

import CheckboxWithArrayValues from "@/components/customComponents/CheckboxWithValues";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { UserRoleUpdateType } from "@/lib/validation";
import { Plus, SaveIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getRolesAction } from "../_actions/get-roles";

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
          roleId: [],
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
          <InputWithLabel name="userId" fieldTitle="UserId" disabled={!!id} />
        </div>

        {isFetchingRolePending ? (
          <div className="flex flex-col space-y-2">
            Fetching Roles...
            <Skeleton className="w-full h-6 animate-pulse" />
            <Skeleton className="w-md h-6 animate-pulse" />
            <Skeleton className="w-sm h-6 animate-pulse" />
          </div>
        ) : (
          <>
            {/* <SelectWithLabel
              name="roleId"
              fieldTitle={id ? "Update Role" : "Role"}
              disabled={isPending}
              data={roles ?? []}
              valueKey="id"
              selectedKey="name"
              placeholder="Select Role"
            /> */}

            <CheckboxWithArrayValues
              name="roleId"
              fieldTitle="Roles"
              data={
                roles?.flatMap((rs) => ({
                  ...rs,
                  name: rs.name.split("_").join(" "),
                })) ?? []
              }
              labelKey="name"
              valueKey="id"
              className="space-y-2"
            />
          </>
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
