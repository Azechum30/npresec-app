"use client";

import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema, ResetPasswordType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWithLabel from "./InputWithLabel";
import LoadingButton from "./LoadingButton";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/lib/server-only-actions/authenticate";
import { toast } from "sonner";

type ResetPasswordFormProps = {
  onSubmit: () => void;
};

const ResetPasswordForm = () => {
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      token: "",
    },
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const token = searchParams.get("token") as string;

  const handlePasswordReset = async (values: ResetPasswordType) => {
    startTransition(async () => {
      const res = await resetPasswordAction({ ...values, token });

      if (res.error) {
        toast.error(res.error);
      } else if (res.errors) {
        const errors = res.errors;
        if ("password" in errors) {
          form.setError("password", {
            type: "server",
            message: errors.password as string,
          });
        }
      } else {
        toast.success("Password reset successfully");
        router.push("/authenticate");
      }
    });
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Kindly provide a new password to reset your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handlePasswordReset)}
            className="space-y-4 w-full p-4">
            <InputWithLabel<ResetPasswordType>
              name="password"
              fieldTitle="New Password"
              placeholder="Enter a new password"
              type="password"
              className="placeholder:text-xs"
            />
            <InputWithLabel<ResetPasswordType>
              name="confirmPassword"
              fieldTitle="Confirm Password"
              placeholder="re-enter password"
              type="password"
              className="placeholder:text-xs"
            />
            <LoadingButton loading={isPending}>
              {isPending ? "Resetting Password" : "Reset Password"}
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ResetPasswordForm;
