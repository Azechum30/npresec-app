/** biome-ignore-all assist/source/organizeImports: reason */
import LoadingButton from "@/components/customComponents/LoadingButton";
import ModernInputWithLabel from "@/components/customComponents/ModernInputWithLabel";
import ModernPasswordInputWithLabel from "@/components/customComponents/ModernPasswordInputWithLabel";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { UserSchema, type UserType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Plus, SaveIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { rolesQueryOptions } from "../../roles/actions/tanstack-queries";

type CreateUserFormProps = {
  onSubmit: (data: UserType) => void;
  id?: string;
  defaultValues?: UserType;
  isPending?: boolean;
};

export const CreateUserForm = ({
  onSubmit,
  id,
  defaultValues,
  isPending,
}: CreateUserFormProps) => {
  const form = useForm<UserType>({
    mode: "onBlur",
    resolver: zodResolver(UserSchema),
    defaultValues: defaultValues
      ? defaultValues
      : {
          username: "",
          email: "",
          role: "",
          password: "",
          confirmPassword: "",
        },
  });

  const { dialogs } = useGenericDialog();

  const isOpen = !!dialogs["create-auth-user"];

  const { data } = useQuery({
    ...rolesQueryOptions,
    enabled: isOpen,
  });
  const handleFormSubmit = (data: UserType) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 p-4 border max-h-[80vh] rounded-md overflow-auto">
        <ModernInputWithLabel
          name="username"
          fieldTitle="Username"
          placeholder="JohnDoe"
          showFocusRing={true}
          schema={UserSchema}
          className="h-10"
        />
        <ModernInputWithLabel
          name="email"
          fieldTitle="Email"
          placeholder="johndoe@example.com"
          type="email"
          showFocusRing={true}
          schema={UserSchema}
          className="h-10"
        />

        <SelectWithLabel
          name="role"
          fieldTitle="Role"
          data={
            data?.map((r) => ({
              id: r.id,
              name: r.name.replaceAll(/_/g, " "),
            })) ?? []
          }
          valueKey="id"
          selectedKey="name"
          placeholder="Select user role"
        />

        <ModernPasswordInputWithLabel
          name="password"
          fieldTitle="Password"
          placeholder="Enter at least 6 letters"
          showToggleButton={true}
          schema={UserSchema}
          className="h-10"
        />
        <ModernPasswordInputWithLabel
          name="confirmPassword"
          fieldTitle="Confirm Password"
          placeholder="Enter at least 6 letters"
          showToggleButton={true}
          schema={UserSchema}
          className="h-10"
        />

        <LoadingButton loading={isPending as boolean}>
          {id ? (
            isPending ? (
              <>
                <SaveIcon />
                Updating user...
              </>
            ) : (
              <>
                <SaveIcon />
                Update User
              </>
            )
          ) : isPending ? (
            <>
              <Plus />
              Creating user...
            </>
          ) : (
            <>
              <Plus />
              Create User
            </>
          )}
        </LoadingButton>
      </form>
    </Form>
  );
};
