"use client";

import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
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
          <div className="flex flex-col space-y-1 max-w-lg h-full mx-auto p-1.5">
            <span className="mb-2 block">Fetching Roles...</span>
            <Skeleton className="w-full max-w-md h-4 animate-pulse" />
            <Skeleton className="w-full max-w-sm h-4 animate-pulse" />
            <Skeleton className="w-full max-w-md h-4 animate-pulse" />
          </div>
        ) : (
          <>
            <MultiSelectCombox
              name="roleId"
              fieldTitle="Roles"
              data={
                roles?.flatMap((rs) => ({
                  ...rs,
                  name: rs.name.split("_").join(" "),
                })) ?? []
              }
              selectedKey="name"
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
