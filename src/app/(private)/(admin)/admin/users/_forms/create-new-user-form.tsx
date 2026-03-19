import LoadingButton from "@/components/customComponents/LoadingButton";
import ModernInputWithLabel from "@/components/customComponents/ModernInputWithLabel";
import ModernPasswordInputWithLabel from "@/components/customComponents/ModernPasswordInputWithLabel";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import { Form } from "@/components/ui/form";
import { UserSchema, UserType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, SaveIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getRolesAction } from "../_actions/get-roles";

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

  const [isFetchingRoles, startFetchRoles] = useTransition();
  const [userRoles, setUserRoles] = useState<
    { id: string; name: string }[] | undefined
  >();

  useEffect(() => {
    startFetchRoles(async () => {
      const { error, roles } = await getRolesAction();

      if (error) {
        toast.error(error);
        return;
      }

      if (roles) {
        setUserRoles(
          roles.map((role) => ({
            ...role,
            name: role.name.includes("_")
              ? role.name.split("_").join(" ")
              : role.name,
          })),
        );
        return;
      }
    });
  }, []);

  const handleFormSubmit = (data: UserType) => {
    onSubmit(data);
  };

  return (
    <>
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

          {isFetchingRoles ? (
            <div>Fetching roles...</div>
          ) : (
            <SelectWithLabel
              name="role"
              fieldTitle="Role"
              data={userRoles ?? []}
              valueKey="id"
              selectedKey="name"
              placeholder="Select user role"
            />
          )}
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
              <>
                {isPending ? (
                  <>
                    <SaveIcon />
                    Updating user...
                  </>
                ) : (
                  <>
                    <SaveIcon />
                    Update User
                  </>
                )}
              </>
            ) : (
              <>
                {isPending ? (
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
              </>
            )}
          </LoadingButton>
        </form>
      </Form>
    </>
  );
};
