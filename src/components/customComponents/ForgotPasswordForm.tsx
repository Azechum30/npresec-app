"use client";

import { Form } from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "@/components/customComponents/LoadingButton";
import { useRef, useState, useTransition } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { authClient } from "@/lib/auth-client";
import { ErrorComponent } from "./ErrorComponent";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  CircleCheckBigIcon,
  Eye,
  Loader,
  Mail,
  MailCheck,
  Shield,
  Sparkle,
} from "lucide-react";
import { Badge } from "../ui/badge";
import ModernInputWithLabel from "./ModernInputWithLabel";
import { ForgotPasswordSchema } from "@/lib/validation";
import { Scope } from "@sentry/nextjs";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ResetPasswordSchema = z.object({
  email: z.string().email(),
});

type ResetPasswordType = z.infer<typeof ResetPasswordSchema>;

export default function ForgotPassword() {
  const forgotPasswordRef = useRef<HTMLDivElement | null>(null);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isLoading, setIsLoding] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const form = useForm<ResetPasswordType>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: { email: "" },
  });

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean | null>(null);

  useGSAP(
    () => {
      if (!forgotPasswordRef.current) return;

      gsap.set(".forgot-password-container", {
        opacity: 0,
        y: 50,
        scale: 0.9,
      });
      gsap.set(".forgot-password-badge", {
        opacity: 0,
        y: -30,
        scale: 0.8,
        rotation: -10,
      });
      gsap.set(".forgot-password-title", {
        opacity: 0,
        y: 30,
        rotateX: 45,
      });
      gsap.set(".forgot-password-divider", {
        opacity: 0,
        scaleX: 0,
      });
      gsap.set(".forgot-password-field", {
        opacity: 0,
        x: -30,
        scale: 0.95,
      });
      gsap.set(".forgot-password-button", {
        opacity: 0,
        y: 20,
        scale: 0.9,
      });
      gsap.set(".sending-email-error", {
        opacity: 0,
        y: -20,
        scale: 0.9,
      });

      gsap.set(".floating-decoration", {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });

      const mTL = gsap.timeline({
        delay: 0.9,
        onComplete: () => setIsLoding(true),
      });

      mTL
        .to(".forgot-password-container", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .to(
          ".forgot-password-badge",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        )
        .to(
          ".forgot-password-title",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .to(
          ".forgot-password-divider",
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          ".forgot-password-field",
          {
            opacity: 1,
            x: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "back.out(1.2)",
          },
          "-=0.2",
        )
        .to(
          ".forgot-password-button",
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        );
      gsap.to(".floating-decoration", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
        delay: 0.8,
      });

      gsap.to(".floating-element", {
        y: -15,
        rotation: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.8,
      });

      if (error || success) {
        gsap.fromTo(
          ".sending-email-error",
          { opacity: 0, y: -20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        );
      }
    },
    { scope: forgotPasswordRef, dependencies: [error, success] },
  );

  const handleSubmit = (value: ResetPasswordType) => {
    startTransition(async () => {
      setError(null);
      setSuccess(null);
      await authClient.requestPasswordReset({
        email: value.email,
        redirectTo: "/reset-password",
        fetchOptions: {
          onSuccess: () => {
            setIsRedirecting(true);
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
    <div ref={forgotPasswordRef} className="relative">
      <div className="floating-decoration floating-element absolute -top-8 -right-8 size-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg pointer-events-none" />
      <div className="floating-decoration floating-element absolute -bottom-4 -left-4 size-12 rounded-full blur-md bg-gradient-to-br from-accent/30 to-primary/25 pointer-events-none" />
      <div className="floating-decoration floating-element absolute top-1/2 right-6 size-8 rounded-full blur-sm bg-gradient-to-br from-secondary/25 to-accent/25 pointer-events-none" />
      <div className="floating-decoration absolute top-4 right-4 opacity-30 ">
        <Sparkle className="size-4 text-primary" />
      </div>
      {/*<div className="floating-decoration absolute bottom-6 left-6 opacity-20 ">
        <Eye className="size-4 text-primary" />
      </div>*/}
      <Card className="forgot-password-container container-wrapper relative mb-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-primary/5 to-secondary/5 pointer-events-none" />
        {success ? (
          <div className="sending-email-error p-4">
            <div
              role="banner"
              className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex gap-2 items-start rounded-md text-sm"
            >
              <CircleCheckBigIcon className="size-6 text-primary" />
              We have sent you an email with instructions on how to reset your
              password.
            </div>
          </div>
        ) : (
          <>
            <CardHeader className="text-center relative pb-4">
              <div className="forgot-password-badge flex justify-center mb-4">
                <Badge
                  variant="secondary"
                  className="px-4 py-2 bg-gradient-to-r from-primary/15 to-secondary/15 backdrop-blur-sm border-primary/30 text-primary hover:from-primary/25 hover:secondary/25 transition-all duration-300"
                >
                  <Shield className="size-6" />
                  Secure Password Reset
                </Badge>
              </div>
              <CardTitle className="forgot-password-title text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4">
                Let&apos;s Get You Back In!
              </CardTitle>
              <CardDescription>
                Don’t worry, it happens. Let’s help you sign back in. Follow the
                steps below to create a new password and regain access.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative">
              <div className="forgot-password-divider relative text-center text-sm">
                <div className="absolute inset-0 top-1/2 border-t border-gradient-to-b from-transparcnt via-border to-transparent" />
                <span className="relative bg-background/80 backdrop-blur-sm px-4 py-1 text-muted-foreground border border-border/30 rounded-full">
                  Enter your email to receive a secure reset link.
                </span>
              </div>

              {error && (
                <div className="sending-email-error">
                  <ErrorComponent error={error} />
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-6"
                >
                  <div className="forgot-password-field">
                    <ModernInputWithLabel
                      name="email"
                      fieldTitle="Email Address"
                      schema={ForgotPasswordSchema}
                      leftIcon={<Mail className="size-4" />}
                      variant="glassmorphism"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="forgot-password-button space-y-4">
                    <div
                      className="relative"
                      onMouseOver={() => setHoveredElement("send-email")}
                      onMouseLeave={() => setHoveredElement(null)}
                    >
                      <LoadingButton
                        loading={false}
                        className="relative w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 font-semibold overflow-hidden"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ${
                            hoveredElement === "reset" ? "translate-x-full" : ""
                          }`}
                        />
                        <div className="relative flex items-center justify-center gap-2">
                          {isPending || isRedirecting ? (
                            <>
                              <Loader className="size-6 animate-spin" />
                              {isRedirecting
                                ? "Redirecting..."
                                : "Sending secure link..."}
                            </>
                          ) : (
                            <>
                              <MailCheck className="size-5" />
                              Send Email
                            </>
                          )}
                        </div>
                      </LoadingButton>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </>
        )}
      </Card>
    </div>
    // <Card className="hover:shadow-lg transition-shadow">
    //   {success ? (
    //     <>
    //       <CardHeader>Password Reset Requested </CardHeader>
    //       <CardDescription>
    //         We have sent you an email with instructions on how to reset your
    //         password.
    //       </CardDescription>
    //     </>
    //   ) : (
    //     <>
    //       <CardHeader className="text-center">
    //         <CardTitle>Reset Password</CardTitle>
    //         <CardDescription>
    //           Kindly reset your password by providing your email.
    //         </CardDescription>
    //       </CardHeader>
    //       <CardContent>
    //         <Form {...form}>
    //           <form
    //             onSubmit={form.handleSubmit(handleSubmit)}
    //             className="w-full max-w-md space-y-4 bg-inherit "
    //           >
    //             {error && <ErrorComponent error={error} />}
    //             <InputWithLabel
    //               name="email"
    //               fieldTitle="Email"
    //               placeholder="Enter your email"
    //               type="email"
    //               className="placeholder:text-xs font-normal"
    //               schema={ResetPasswordSchema}
    //             />

    //             <LoadingButton loading={isPending}>Reset</LoadingButton>
    //           </form>
    //         </Form>
    //       </CardContent>
    //     </>
    //   )}
    // </Card>
  );
}
