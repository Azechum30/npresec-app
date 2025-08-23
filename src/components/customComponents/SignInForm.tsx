"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import InputWithLabel from "./InputWithLabel";
import { signInAction } from "@/lib/server-only-actions/authenticate";
import { toast } from "sonner";
import { SignInType, SignInSchema } from "@/lib/validation";
import { useTransition } from "react";
import LoadingButton from "./LoadingButton";
import PasswordInputWithLabel from "./PasswordInputWithLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInForm() {
  const form = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onSubmit(values: SignInType) {
    startTransition(async () => {
      const { error, resetPasswordRequired, resetToken } =
        await signInAction(values);
      if (error) {
        toast.error(error);
      } else if (resetPasswordRequired) {
        router.push(`/password-reset?token=${resetToken}`);
      }
    });
  }
  return (
    <Card className="">
      <CardHeader className="text-center">
        <CardTitle className="uppercase leading-normal text-center">
          Welcome Back!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t after:border-border after:z-0 after:flex after:items-center">
          <span className=" relative z-10 bg-card px-2 text-muted-foreground">
            Login to continue
          </span>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4">
            <div>
              <InputWithLabel<SignInType>
                name="email"
                fieldTitle="Email"
                className="font-normal"
                schema={SignInSchema}
              />
            </div>
            <div>
              <PasswordInputWithLabel<SignInType>
                name="password"
                fieldTitle="Password"
                className="font-normal"
                schema={SignInSchema}
              />
            </div>
            <div>
              <LoadingButton loading={isPending}>Login</LoadingButton>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Forgot your password?{" "}
              <Link className="text-blue-400" href="/forgot-password">
                Reset your password here
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
