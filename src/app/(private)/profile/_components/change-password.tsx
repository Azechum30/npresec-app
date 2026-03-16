"use client";

import LoadingButton from "@/components/customComponents/LoadingButton";
import ModernPasswordInputWithLabel from "@/components/customComponents/ModernPasswordInputWithLabel";
import { Form } from "@/components/ui/form";
import { ChangePasswordSchema, ChangePasswordType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader, Lock } from "lucide-react";
import { useForm } from "react-hook-form";

type ChangePasswordProps = {
  onSubmitAction: (data: ChangePasswordType) => void;
  isPending: boolean;
};

export const ChangePasswordForm = ({
  onSubmitAction,
  isPending,
}: ChangePasswordProps) => {
  const form = useForm<ChangePasswordType>({
    mode: "onBlur",
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handlePasswordChange = (values: ChangePasswordType) => {
    onSubmitAction(values);
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handlePasswordChange)}
          className="w-full space-y-6 border rounded-lg p-4">
          <ModernPasswordInputWithLabel
            name="oldPassword"
            fieldTitle="Current Password"
            showFocusRing={true}
            showToggleButton={true}
            schema={ChangePasswordSchema}
            leftIcon={<Lock className="size-4" />}
          />
          <ModernPasswordInputWithLabel
            name="newPassword"
            fieldTitle="New Password"
            showFocusRing={true}
            showToggleButton={true}
            schema={ChangePasswordSchema}
            leftIcon={<Lock className="size-4" />}
          />
          <ModernPasswordInputWithLabel
            name="confirmNewPassword"
            fieldTitle="Confirm New Password"
            showFocusRing={true}
            showToggleButton={true}
            schema={ChangePasswordSchema}
            leftIcon={<Lock className="size-4" />}
          />
          <div>
            <LoadingButton
              className="group bg-gradient-to-r from-primary/80 h-12 to-secondary/80 hover:from-text-primary hover:to-secondary transition-all duration-300"
              loading={isPending}>
              {isPending ? (
                <>
                  <Loader className="size-5 animate-spin" />
                  Changing Password...
                </>
              ) : (
                <>
                  {" "}
                  <Edit className="size-5 group-hover:scale-110 transition-transform duration-300" />
                  Update Password
                </>
              )}
            </LoadingButton>
          </div>
        </form>
      </Form>
    </>
  );
};
