"use client";

import { Form } from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ResetPasswordSchema, ResetPasswordType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import InputWithLabel from "./InputWithLabel";
import LoadingButton from "./LoadingButton";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordAction } from "@/lib/server-only-actions/authenticate";
import { toast } from "sonner";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Loader, Lock, Shield, Sparkles, Unlock } from "lucide-react";
import { Badge } from "../ui/badge";
import ModernPasswordInputWithLabel from "./ModernPasswordInputWithLabel";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ResetPasswordForm = () => {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const container = useRef<HTMLDivElement | null>(null);
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

  useGSAP(() => {
    if (!container.current) return;

    // set initial states

    gsap.set(".reset-password-container", {
      opacity: 0,
      y: 50,
      scale: 0.9,
    });
    gsap.set(".reset-password-badge", {
      opacity: 0,
      y: -30,
      scale: 0.8,
      rotation: -10,
    });
    gsap.set(".reset-password-title", {
      opacity: 0,
      y: 30,
      rotateX: 45,
    });

    gsap.set(".reset-password-divider", {
      opacity: 0,
      scaleX: 0,
    });
    gsap.set(".reset-password-field", {
      opacity: 0,
      x: -30,
      scale: 0.95,
    });
    gsap.set(".reset-password-button", {
      opacity: 0,
      y: 20,
      scale: 0.9,
    });

    gsap.set(".floating-decoration", {
      opacity: 0,
      scale: 0,
      rotation: -180,
    });

    const mainTL = gsap.timeline({
      delay: 0.2,
      onComplete: () => setIsLoading(true),
    });

    mainTL
      .to(".reset-password-container", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      })
      .to(
        ".reset-password-badge",
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
        ".reset-password-title",
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
        ".reset-password-divider",
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.3",
      )
      .to(
        ".reset-password-field",
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
        ".reset-password-button",
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        },
        "-=0.3",
      );

    // floating decoration
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
  });

  const token = searchParams.get("token") as string;

  const handlePasswordReset = async (values: ResetPasswordType) => {
    startTransition(async () => {
      const res = await resetPasswordAction({ ...values, token });

      if (res?.error) {
        toast.error(res.error);
      } else if (res?.errors) {
        const errors = res.errors;
        if ("password" in errors) {
          form.setError("password", {
            type: "validate",
            message: errors.password?.join(",") as string,
          });
        }
      } else {
        setIsRedirecting(true);
        toast.success("Password reset successfully");
        router.push("/sign-in?success=true");
      }
    });
  };

  return (
    <div ref={container} className="relative">
      <div className="floating-decoration floating-element absolute -top-8 -right-8 size-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg pointer-events-none" />
      <div className="floating-decoration floating-elemnt absolute -bottom-4 -left-4 size-12 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-md pointer-events-none" />
      <div className="floating-decoration floating-element absolute top-1/2 right-6 size-8 bg-gradient-to-br from-secondary/25 to-accent/25 rounded-full blur-sm pointer-events-none" />

      {/*{Sparkles design}*/}
      <div className="floating-decoartation asbolute top-4 right-4 opacity-30">
        <Sparkles className="size-4 text-primary" />
      </div>
      <div className="floating-decoration absolute bottom-6 left-6 opacity-20">
        <Eye className="size-4 text-primary" />
      </div>

      <Card className="reset-password-container container-wrapper relative overflow-hidden bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
        <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-primary/5 to-secondary/5 pointer-events-none" />
        <CardHeader className="text-center relative pb-4">
          <div className="reset-password-badge flex justify-center mb-4">
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-gradient-to-r from-primary/15 to-secondary/15 backdrop-blur-sm border-primary/30 text-primary hover:from-primary/25 hover:secondary/25 transition-all duration-300"
            >
              <Shield className="size-6" />
              Secure Password Reset
            </Badge>
          </div>
          <CardTitle className="reset-password-title text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-4">
            Update Your Password!
          </CardTitle>
          <CardDescription>
            Your password should be at least 8 characters, with a mix of lower
            and uppercase letters, numbers, and symbols.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 relative">
          <div className="reset-password-divider relative text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-gradient-to-b from-transparcnt via-border to-transparent" />
            <span className="relative bg-background/80 backdrop-blur-sm px-4 py-1 text-muted-foreground border border-border/30 rounded-full">
              Enter and confirm your new password.
            </span>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handlePasswordReset)}
              className="space-y-6"
            >
              <div className="reset-password-field">
                <ModernPasswordInputWithLabel
                  name="password"
                  fieldTitle="New Password"
                  schema={ResetPasswordSchema}
                  leftIcon={<Lock className="size-4" />}
                  variant="glassmorphism"
                  placeholder="Enter your new password"
                  showToggleButton={true}
                />
              </div>
              <div className="reset-password-field">
                <ModernPasswordInputWithLabel
                  name="confirmPassword"
                  fieldTitle="New Password"
                  schema={ResetPasswordSchema}
                  leftIcon={<Lock className="size-4" />}
                  variant="glassmorphism"
                  placeholder="Confirm your new password"
                  showToggleButton={true}
                />
              </div>
              <div className="reset-password-button space-y-4">
                <div
                  className="relative"
                  onMouseOver={() => setHoveredElement("reset")}
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
                            : "Resetting Password..."}
                        </>
                      ) : (
                        <>
                          <Unlock className="size-5" />
                          Reset Password
                        </>
                      )}
                    </div>
                  </LoadingButton>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
