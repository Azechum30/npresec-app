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
import {
  signInAction,
  getUserRole,
} from "@/lib/server-only-actions/authenticate";
import { toast } from "sonner";
import { SignInType, SignInSchema } from "@/lib/validation";
import { useState, useTransition } from "react";
import LoadingButton from "./LoadingButton";
import PasswordInputWithLabel from "./PasswordInputWithLabel";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { ErrorComponent } from "./ErrorComponent";

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
  const [signinError, setSignInError] = useState<string | null>(null);

  async function onSubmit(values: SignInType) {
    setSignInError(null);
    startTransition(async () => {
      const { error, data } = await authClient.signIn.email({
        email: values.email.toLowerCase(),
        password: values.password,
      });

      if (error) {
        setSignInError(error.message || "Failed to sign in");
      } else {
        toast.success("login successful!");

        // Check email verification
        if (!data.user.emailVerified) {
          router.push("/verify-email");
          return;
        }

        // Implement role-based routing
        try {
          // Get user role from server
          const roleResult = await getUserRole();

          if (roleResult.error) {
            console.error("Failed to get user role:", roleResult.error);
            router.push("/");
            return;
          }

          const userRole = roleResult.role;

          // Redirect based on role
          switch (userRole) {
            case "admin":
              router.push("/admin/dashboard");
              break;
            case "teacher":
              router.push("/teachers");
              break;
            case "student":
            default:
              router.push("/students");
              break;
          }
        } catch (roleError) {
          console.error("Failed to get user role:", roleError);
          // Fallback to home page if role retrieval fails
          router.push("/");
        }
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
        {signinError && <ErrorComponent error={signinError} />}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4">
            <div>
              <InputWithLabel
                name="email"
                fieldTitle="Email"
                className="font-normal"
                schema={SignInSchema}
              />
            </div>
            <div>
              <PasswordInputWithLabel
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
