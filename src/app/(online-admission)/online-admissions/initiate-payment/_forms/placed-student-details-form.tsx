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
import {
  Banknote,
  CreditCard,
  Loader,
  Mail,
  PersonStanding,
  Phone,
} from "lucide-react";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { initializePayment } from "../_actions/server-only-actions";

export const InitiatePaymentForm = ({
  studentId,
  amount,
  currency,
  serviceTypeId,
  serviceName,
}: {
  studentId: string;
  serviceTypeId: string;
  serviceName: string;
  amount: string | number;
  currency: CURRENCY;
}) => {
  const form = useForm<InitiatePaymentType>({
    mode: "onChange",
    resolver: zodResolver(InitiatePaymentSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      studentId: studentId,
      amount: amount,
      currency: currency,
      serviceTypeId: serviceTypeId,
      serviceName: serviceName,
    },
  });

  const [isPending, startProcessTransition] = useTransition();

  const handleSubmit = (values: InitiatePaymentType) => {
    try {
      startProcessTransition(async () => {
        const { error, url, message } = await initializePayment(values);

        if (error) {
          toast.error(error);
          return;
        }

        if (message) {
          toast.message(message);
          return;
        }

        if (url) {
          toast.success("Payment Initiated");
          window.location.href = url;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Card className="shadow-lg border-t-4 border-t-primary">
      <CardHeader className="border-b pb-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/25">
            <CreditCard className="size-3" />
            Step 2 of 5 &mdash; Payment
          </span>
        </div>
        <CardTitle className="flex items-center gap-3 mb-2">
          <span className="size-11 rounded-full bg-primary/15 flex justify-center items-center shrink-0">
            <Banknote className="size-6" />
          </span>
          <h1 className="text-xl font-bold bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent tracking-tight">
            Initiate Payment
          </h1>
        </CardTitle>
        <CardDescription className="bg-primary/5 rounded-lg p-3 border font-mono text-xs text-justify leading-relaxed">
          Fill in your details below to start the payment process. Ensure the
          email address you provide is valid — all payment summaries and
          receipts will be sent there.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4">
            <ModernInputWithLabel
              name="amount"
              fieldTitle="Amount Due"
              schema={InitiatePaymentSchema}
              showFocusRing={true}
              leftIcon={
                <span className="font-semibold text-sm">{currency}</span>
              }
              className="h-11 font-semibold"
              disabled
            />
            <ModernInputWithLabel
              name="name"
              fieldTitle="Full Name"
              schema={InitiatePaymentSchema}
              showFocusRing={true}
              placeholder="Enter your full name"
              leftIcon={<PersonStanding className="size-4" />}
              className="h-11"
            />
            <ModernInputWithLabel
              name="phone"
              fieldTitle="Phone Number"
              schema={InitiatePaymentSchema}
              showFocusRing={true}
              placeholder="e.g 0545454545"
              leftIcon={<Phone className="size-4" />}
              className="h-11"
            />
            <ModernInputWithLabel
              name="email"
              fieldTitle="Email Address"
              schema={InitiatePaymentSchema}
              showFocusRing={true}
              placeholder="johndoe@example.com"
              leftIcon={<Mail className="size-4" />}
              className="h-11"
            />
            <LoadingButton
              className="h-11 w-full"
              disabled={!form.formState.isValid}
              loading={isPending}>
              {isPending ? (
                <>
                  <Loader className="size-4 animate-spin mr-2" />
                  Initiating payment...
                </>
              ) : (
                <>Proceed to Payment</>
              )}
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
