"use client";

import LoadingButton from "@/components/customComponents/LoadingButton";
import ModernInputWithLabel from "@/components/customComponents/ModernInputWithLabel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  CURRENCY,
  InitiatePaymentSchema,
  InitiatePaymentType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, Loader, Mail, PersonStanding } from "lucide-react";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { initializePayment } from "../_actions/server-only-actions";

export const InitiatePaymentForm = ({
  studentId,
  amount,
  currency,
}: {
  studentId: string;
  amount: number;
  currency: CURRENCY;
}) => {
  const form = useForm<InitiatePaymentType>({
    mode: "onChange",
    resolver: zodResolver(InitiatePaymentSchema),
    defaultValues: {
      email: "",
      name: "",
      studentId: studentId,
      amount: amount,
      currency: currency,
    },
  });

  const [isPending, startProcessTransition] = useTransition();

  const handleSubmit = (values: InitiatePaymentType) => {
    try {
      startProcessTransition(async () => {
        const { error, url } = await initializePayment(values);

        if (error) {
          toast.error(error);
          return;
        }

        if (url) {
          console.log("URL", url);
          toast.success("Payment Initiated");

          window.location.href = url;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <Card className="shadow-sm hover:shadow-2xl hover:backdrop-blur-xl transition-shadow">
        <CardHeader className="border-b">
          <CardTitle className=" flex items-center space-x-2  mb-3">
            <span className="size-12 rounded-full bg-primary/15 p-1 flex justify-center items-center">
              <Banknote className="size-8" />
            </span>
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent tracking-tight">
              Initiate Payment
            </h1>
          </CardTitle>
          <CardDescription className="bg-primary/5 rounded-md p-2 border font-mono">
            Fill in your details below to start the payment process. Ensure that
            the email you are using is a valid email. All payment sumarries and
            details about the payment would be sent to the email address.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 rounded-md border p-4">
              <ModernInputWithLabel
                name="amount"
                fieldTitle="Amount Due"
                schema={InitiatePaymentSchema}
                showFocusRing={true}
                leftIcon={<span>{currency}</span>}
                className="h-10"
                disabled
              />
              <ModernInputWithLabel
                name="name"
                fieldTitle="Fullname"
                schema={InitiatePaymentSchema}
                showFocusRing={true}
                placeholder="Fullname"
                leftIcon={<PersonStanding />}
                className="h-10"
              />
              <ModernInputWithLabel
                name="email"
                fieldTitle="Email"
                schema={InitiatePaymentSchema}
                showFocusRing={true}
                placeholder="johndoe@example.com"
                leftIcon={<Mail />}
                className="h-10"
              />

              <LoadingButton
                className="h-10"
                disabled={!form.formState.isValid}
                loading={isPending}>
                {isPending ? (
                  <>
                    <Loader className="size-5 animate-spin mr-2" />
                    Initiating payment...
                  </>
                ) : (
                  <>Start Payment Process</>
                )}
              </LoadingButton>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
