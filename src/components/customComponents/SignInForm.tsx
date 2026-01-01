"use client";

import { useRef, useState, useTransition, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Route } from "next";
import { Form } from "../ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import ModernInputWithLabel from "./ModernInputWithLabel";
import ModernPasswordInputWithLabel from "./ModernPasswordInputWithLabel";
import LoadingButton from "./LoadingButton";
import { ErrorComponent } from "./ErrorComponent";
import { useRouteTracking } from "@/components/providers/RouteTrackingProvider";
import {
  signInAction,
  sendVerificationEmailAction,
} from "@/lib/server-only-actions/authenticate";
import { SignInType, SignInSchema } from "@/lib/validation";
import { toast } from "sonner";
import {
  Loader,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Shield,
  Eye,
} from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SignInForm() {
  const container = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  const form = useForm<SignInType>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getCallbackUrl } = useRouteTracking();

  // Get callback URL from search params immediately
  const searchParamCallback = searchParams.get("callbackUrl");

  // Get callback URL using useMemo to avoid effects
  const callbackUrl = useMemo(() => {
    // First priority: explicit callback from URL params
    if (searchParamCallback) {
      return searchParamCallback;
    }

    // Second priority: tracked callback (client-side only)
    if (typeof window !== "undefined") {
      try {
        return getCallbackUrl();
      } catch (error) {
        // Route tracking not available yet
        return null;
      }
    }

    return null;
  }, [searchParamCallback, getCallbackUrl]);

  const [signinError, setSignInError] = useState<string | null>(null);
  const [notEmailVerified, setNotEmailVerified] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [isSendingEmail, startSendingEmailTransition] = useTransition();

  // GSAP Animations
  useGSAP(
    () => {
      if (!container.current) return;

      // Set initial states
      gsap.set(".signin-container", { opacity: 0, y: 50, scale: 0.9 });
      gsap.set(".signin-badge", {
        opacity: 0,
        y: -30,
        scale: 0.8,
        rotation: -10,
      });
      gsap.set(".signin-title", { opacity: 0, y: 30, rotationX: 45 });
      gsap.set(".signin-divider", { opacity: 0, scaleX: 0 });
      gsap.set(".signin-field", { opacity: 0, x: -30, scale: 0.95 });
      gsap.set(".signin-button", { opacity: 0, y: 20, scale: 0.9 });
      gsap.set(".signin-link", { opacity: 0, y: 10 });
      gsap.set(".floating-decoration", {
        opacity: 0,
        scale: 0,
        rotation: -180,
      });
      gsap.set(".signin-error", { opacity: 0, y: -20, scale: 0.9 });

      // Main entrance timeline
      const mainTl = gsap.timeline({
        delay: 0.2,
        onComplete: () => setIsLoaded(true),
      });

      mainTl
        .to(".signin-container", {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        })
        .to(
          ".signin-badge",
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
          ".signin-title",
          {
            opacity: 1,
            y: 0,
            rotationX: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .to(
          ".signin-divider",
          {
            opacity: 1,
            scaleX: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "-=0.3",
        )
        .to(
          ".signin-field",
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
          ".signin-button",
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
          },
          "-=0.3",
        )
        .to(
          ".signin-link",
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          "-=0.2",
        );

      // Floating decorations
      gsap.to(".floating-decoration", {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        stagger: 0.3,
        ease: "elastic.out(1, 0.5)",
        delay: 0.8,
      });

      // Continuous floating animation
      gsap.to(".floating-element", {
        y: -15,
        rotation: 10,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.8,
      });

      // Error animation
      if (signinError) {
        gsap.fromTo(
          ".signin-error",
          { opacity: 0, y: -20, scale: 0.9 },
          { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        );
      }
    },
    { scope: container, dependencies: [signinError] },
  );

  async function onSubmit(values: SignInType) {
    setSignInError(null);
    setNotEmailVerified(false);
    setEmail(values.email);
    startTransition(async () => {
      const result = await signInAction(
        {
          email: values.email.toLowerCase(),
          password: values.password,
        },
        callbackUrl || undefined,
      );

      if (result.error) {
        if (result.error.includes("Email not verified")) {
          setNotEmailVerified(true);
          setSignInError(
            "Your email is not verified. Kindly visit your inbox to verify your email before you continue to login.",
          );
          return;
        }
        setSignInError(result.error);
      } else if (result.success && result.redirectTo) {
        toast.success("Login successful!");
        setEmail(null);

        // Check if user has emailVerified - if not, redirect to verification page
        if (result.user && !result.user.emailVerified) {
          router.push("/verify-email");
          return;
        }

        // Server action now handles redirect logic, just use the returned path
        setIsRedirecting(true);
        router.push(result.redirectTo as Route);
      } else if (result.success) {
        toast.success("Login successful!");
        setEmail(null);
        // Fallback redirect if no redirectTo provided
        router.push("/profile");
      } else {
        setSignInError("Something went wrong during sign in");
      }
    });
  }

  const sendVerificationMail = () => {
    startSendingEmailTransition(async () => {
      try {
        const result = await sendVerificationEmailAction(email as string);

        if (result.success) {
          toast.success(result.message || "Verification email sent!");
          setNotEmailVerified(false);
        } else {
          setSignInError(result.error || "Could not send verification email");
        }
      } catch (error) {
        setSignInError("Could not send verification email");
      }
    });
  };

  return (
    <div ref={container} className="relative">
      {/* Floating decorations */}
      <div className="floating-decoration floating-element absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-lg pointer-events-none" />
      <div className="floating-decoration floating-element absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-br from-accent/30 to-primary/30 rounded-full blur-md pointer-events-none" />
      <div className="floating-decoration floating-element absolute top-1/2 -right-6 w-8 h-8 bg-gradient-to-br from-secondary/25 to-accent/25 rounded-full blur-sm pointer-events-none" />

      {/* Sparkle decorations */}
      <div className="floating-decoration absolute top-4 right-4 opacity-30">
        <Sparkles className="w-5 h-5 text-primary" />
      </div>
      <div className="floating-decoration absolute bottom-6 left-6 opacity-20">
        <Eye className="w-4 h-4 text-secondary" />
      </div>

      <Card className="signin-container relative overflow-hidden bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />

        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <CardHeader className="text-center relative pb-4">
          {/* Badge */}
          <div className="signin-badge flex justify-center mb-4">
            <Badge
              variant="secondary"
              className="px-4 py-2 bg-gradient-to-r from-primary/15 to-secondary/15 backdrop-blur-sm border-primary/30 text-primary hover:from-primary/25 hover:to-secondary/25 transition-all duration-300"
            >
              <Shield className="w-4 h-4 mr-2" />
              Secure Login
            </Badge>
          </div>

          <CardTitle className="signin-title text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent mb-2">
            Welcome Back!
          </CardTitle>

          <p className="text-muted-foreground text-sm">
            Sign in to your account to continue
          </p>
        </CardHeader>

        <CardContent className="space-y-6 relative">
          {/* Divider */}
          <div className="signin-divider relative text-center text-sm">
            <div className="absolute inset-0 top-1/2 border-t border-gradient-to-r from-transparent via-border to-transparent" />
            <span className="relative bg-background/80 backdrop-blur-sm px-4 text-muted-foreground border border-border/30 rounded-full">
              Enter your credentials
            </span>
          </div>

          {/* Error display */}
          {signinError && (
            <div className="signin-error">
              <ErrorComponent error={signinError} />
            </div>
          )}

          {/* Email verification button */}
          {notEmailVerified && email && (
            <div className="signin-error">
              <Button
                disabled={isSendingEmail}
                variant="outline"
                className="w-full relative overflow-hidden bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-orange-200 text-orange-700 hover:border-orange-300 transition-all duration-300"
                onClick={sendVerificationMail}
                onMouseEnter={() => setHoveredElement("verify-email")}
                onMouseLeave={() => setHoveredElement(null)}
              >
                {/* Shimmer effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ${
                    hoveredElement === "verify-email" ? "translate-x-full" : ""
                  }`}
                />

                <div className="relative flex items-center justify-center gap-2">
                  {isSendingEmail ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Sending verification email...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      Send verification email
                    </>
                  )}
                </div>
              </Button>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="signin-field">
                <ModernInputWithLabel
                  name="email"
                  fieldTitle="Email Address"
                  className="font-normal"
                  schema={SignInSchema}
                  leftIcon={<Mail className="w-4 h-4" />}
                  variant="glassmorphism"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Password Field */}
              <div className="signin-field">
                <ModernPasswordInputWithLabel
                  name="password"
                  fieldTitle="Password"
                  className="font-normal"
                  schema={SignInSchema}
                  leftIcon={<Lock className="w-4 h-4" />}
                  variant="glassmorphism"
                  placeholder="Enter your password"
                  showToggleButton={true}
                />
              </div>

              {/* Submit Button */}
              <div className="signin-button space-y-4">
                <div
                  className="relative"
                  onMouseEnter={() => setHoveredElement("login")}
                  onMouseLeave={() => setHoveredElement(null)}
                >
                  <LoadingButton
                    loading={isPending || isRedirecting}
                    className="w-full relative overflow-hidden bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 h-12 font-semibold"
                  >
                    {/* Shimmer effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full transition-transform duration-700 ${
                        hoveredElement === "login" ? "translate-x-full" : ""
                      }`}
                    />

                    <div className="relative flex items-center justify-center gap-2">
                      {isPending || isRedirecting ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          {isRedirecting ? "Redirecting..." : "Signing in..."}
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </div>
                  </LoadingButton>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="signin-link text-center">
                <p className="text-sm text-muted-foreground">
                  Forgot your password?{" "}
                  <Link
                    href={"/forgot-password" as Route}
                    className="font-medium text-primary hover:text-primary/80 transition-colors duration-300 relative group"
                    onMouseEnter={() => setHoveredElement("forgot-password")}
                    onMouseLeave={() => setHoveredElement(null)}
                  >
                    Reset it here
                    <span
                      className={`absolute -bottom-1 left-0 h-px bg-gradient-to-r from-primary to-secondary transition-all duration-300 ${
                        hoveredElement === "forgot-password" ? "w-full" : "w-0"
                      }`}
                    />
                  </Link>
                </p>
              </div>
            </form>
          </Form>
        </CardContent>

        {/* Bottom gradient line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </Card>
    </div>
  );
}
