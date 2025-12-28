"use client";

import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { authClient } from "@/lib/auth-client";
import { ErrorComponent } from "./ErrorComponent";

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export default function ForgotPassword() {
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (value: ResetPasswordType) => {
    startTransition(async () => {
      setError(null);
      const { error } = await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setError(error.message as string);
        return;
      }

      toast.success(
        "A password reset link has been sent to your email. Please check your inbox.",
      );
    });
  };
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Kindly reset your password by providing your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full max-w-md space-y-4 bg-inherit "
          >
            {error && <ErrorComponent error={error} />}
            <InputWithLabel
              name="email"
              fieldTitle="Email"
              placeholder="Enter your email"
              type="email"
              className="placeholder:text-xs font-normal"
              schema={ResetPasswordSchema}
            />

            <LoadingButton loading={isPending}>Reset</LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
