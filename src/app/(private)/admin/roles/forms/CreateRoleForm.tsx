import { RoleSchema, RoleType } from "@/lib/validation";
import { useForm, useWatch } from "react-hook-form";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import { getPermissions } from "@/app/(private)/admin/permissions/actions/queries";
import { toast } from "sonner";
import CheckboxWithArrayValues from "@/components/customComponents/CheckboxWithValues";
import { PermissionResponseType } from "@/lib/types";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { PenBoxIcon, PlusCircle } from "lucide-react";
import { useDebounce } from "@/app/(private)/admin/roles/hooks/use-debounce";

type CreateRoleFormProps = {
  onSubmit: (values: RoleType) => Promise<void>;
  defaultValues?: RoleType;
  id?: string;
  isPending?: boolean;
};

export const CreateRoleForm = ({
  onSubmit,
  defaultValues,
  id,
  isPending,
}: CreateRoleFormProps) => {
  const form = useForm<RoleType>({
    resolver: zodResolver(RoleSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          name: "",
          permissions: [],
        },
  });

  const [permissions, setPermission] = useState<PermissionResponseType[]>();
  const [error, setError] = useState<string>();
  const role = useWatch({
    control: form.control,
    name: "name",
  });

  const debounceRole = useDebounce(role, 300);

  useEffect(() => {
    const fetchPermission = async () => {
      const result = await getPermissions();

      if (result.error) {
        return setError(result.error);
      }

      if (result.permissions) {
        setPermission(result.permissions);
      }
    };

    fetchPermission();
  }, []);

  const handleSubmit = async (values: RoleType) => {
    await onSubmit(values);
  };

  if (error) {
    toast.error(error);
    return null;
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 w-full h-fit text-left rounded-md border p-4">
          <InputWithLabel<RoleType>
            name="name"
            fieldTitle="Role Name"
            schema={RoleSchema}
          />

          {permissions && debounceRole && (
            <CheckboxWithArrayValues<RoleType>
              name="permissions"
              fieldTitle="Role Permissions"
              data={permissions.map((perm) => ({
                ...perm,
                name: perm.name.split(":").join(" "),
              }))}
              valueKey="id"
              labelKey="name"
              schema={RoleSchema as any}
            />
          )}

          <LoadingButton loading={isPending as boolean}>
            {id ? (
              <>
                <PenBoxIcon className="size-5 mr-1" />
                {isPending ? "Updating Role..." : "Update Role"}
              </>
            ) : (
              <>
                <PlusCircle className="size-5 mr-1" />
                {isPending ? "Creating Role..." : "Create Role"}
              </>
            )}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
