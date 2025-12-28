"use client";

import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWithLabel from "@/components/customComponents/InputWithLabel";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { useState, useTransition } from "react";
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
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleSubmit = (value: ResetPasswordType) => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/reset-password",
        fetchOptions: {
          onSuccess: () => {
            setSuccess(true);
          },
          onError: () => {
            setError("An error occurred");
          },
        },
      });
    });
  };
  return (
    <Card className="hover:shadow-lg transition-shadow">
      {success ? (
        <>
          <CardHeader>Password Reset Requested </CardHeader>
          <CardDescription>
            We have sent you an email with instructions on how to reset your
            password.
          </CardDescription>
        </>
      ) : (
        <>
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
        </>
      )}
    </Card>
  );
}
