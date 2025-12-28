import InputWithLabel from "@/components/customComponents/InputWithLabel";
import { Form } from "@/components/ui/form";
import { UserSchema, UserType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { getRolesAction } from "../_actions/get-roles";
import { toast } from "sonner";
import SelectWithLabel from "@/components/customComponents/SelectWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { Plus, SaveIcon } from "lucide-react";

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
          }))
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
          <InputWithLabel
            name="username"
            fieldTitle="Username"
            placeholder="JohnDoe"
          />
          <InputWithLabel
            name="email"
            fieldTitle="Email"
            placeholder="johndoe@example.com"
            type="email"
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
          <InputWithLabel
            name="password"
            fieldTitle="Password"
            placeholder="Enter at least 6 letters"
            type="password"
          />
          <InputWithLabel
            name="confirmPassword"
            fieldTitle="Confirm Password"
            placeholder="Enter at least 6 letters"
            type="password"
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
