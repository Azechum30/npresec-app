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
import { Button } from "../ui/button";
import { Loader } from "lucide-react";

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
  const [notEmailVerified, setNotEmailVerified] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isSendingEmail, startSendingEmailTransition] = useTransition();

  async function onSubmit(values: SignInType) {
    setSignInError(null);
    setNotEmailVerified(false);
    setEmail(values.email);
    startTransition(async () => {
      const { error, data } = await authClient.signIn.email({
        email: values.email.toLowerCase(),
        password: values.password,
      });

      if (error) {
        if (error.message?.includes("Email not verified")) {
          setNotEmailVerified(true);
          setSignInError(
            "Your email is not verified. Kindly visit your inbox to verify your email before you continue to login."
          );
          return;
        }
        setSignInError(error.message || "Failed to sign in");
      } else {
        toast.success("login successful!");
        setEmail(null);

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

  const sendVerificationMail = () => {
    startSendingEmailTransition(async () => {
      await authClient.sendVerificationEmail({
        email: email as string,
        callbackURL: "/email-verified",
        fetchOptions: {
          onSuccess: () => {
            toast.success("verification email sent!");
          },
          onError: () => {
            setSignInError("Could not send verification email");
          },
        },
      });
    });
  };
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

        {notEmailVerified && email && (
          <Button
            disabled={isSendingEmail}
            variant="outline"
            className="w-full"
            onClick={sendVerificationMail}>
            {isSendingEmail ? (
              <>
                <Loader className="size-6 animate-spin" /> Sending Mail...
              </>
            ) : (
              <>Send verification email</>
            )}
          </Button>
        )}
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
