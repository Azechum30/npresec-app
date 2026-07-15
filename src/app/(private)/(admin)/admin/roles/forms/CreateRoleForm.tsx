/**biome-ignore-all assist/source/organizeImports: reason */
import { useDebounce } from "@/app/(private)/(admin)/admin/roles/hooks/use-debounce";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { MultiSelectCombox } from "@/components/customComponents/mult-select-combox";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { RoleSchema, type RoleType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { PenBoxIcon, PlusCircle } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { permissionsQueryOptions } from "../../permissions/actions/tanstack-queries";

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

  const role = useWatch({
    control: form.control,
    name: "name",
  });

  const debounceRole = useDebounce(role, 300);
  const { dialogs } = useGenericDialog();

  const isOpen = !!dialogs["create-role"] || !!dialogs["edit-role"];
  const { data } = useQuery({
    ...permissionsQueryOptions,
    enabled: isOpen,
  });

  const handleSubmit = async (values: RoleType) => {
    await onSubmit(values);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 w-full max-h-[80vh] text-left rounded-md border p-4 overflow-auto">
        <InputWithLabel
          name="name"
          fieldTitle="Role Name"
          schema={RoleSchema}
        />

        {data && debounceRole && (
          <MultiSelectCombox
            name="permissions"
            fieldTitle="Role Permissions"
            data={data.map((perm) => ({
              ...perm,
              name: perm.name.split(":").join(" "),
            }))}
            valueKey="id"
            selectedKey="name"
            schema={RoleSchema}
            placeholder="Assign permissions this role"
            // className="space-y-2 grid grid-cols-2 "
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
  );
};
