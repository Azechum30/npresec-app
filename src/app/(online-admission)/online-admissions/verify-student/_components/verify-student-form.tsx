"use client";

import { GenericSelectWithLabel } from "@/components/customComponents/generic-select-with-label";
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
  FEE_PAYMENT_STATUS,
  VerifyStudentSchema,
  VerifyStudentType,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Loader,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { getPlaceStudentByIndex } from "../_actions/get-placed-student-by-index";
import { getServiceTypes } from "../_actions/get-service-types";

export const VerifyStudentForm = () => {
  const form = useForm<VerifyStudentType>({
    mode: "onChange",
    resolver: zodResolver(VerifyStudentSchema),
    defaultValues: {
      studentId: "",
      paymentType: "",
      serviceName: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [serviceTypes, setServiceTypes] = useState<
    | { id: string; name: string; deadline: Date; status: FEE_PAYMENT_STATUS }[]
    | undefined
  >();

  const selectedServiceType = useWatch({
    control: form.control,
    name: "paymentType",
  });

  const studentId = useWatch({
    control: form.control,
    name: "studentId",
  });

  const [isServiceAvailable, setIsServiceAvailable] = useState(false);
  const [serviceTitle, setServiceTitle] = useState("");
  // const [serviceName, setServiceName] = useState("");

  // useEffect(() => {
  //   if (!selectedServiceType || !serviceTypes) return;
  //   const selected = serviceTypes.find((s) => s.id === selectedServiceType);
  //   startTransition(() => {
  //     if (selected) {
  //       setServiceName(selected.name);
  //     }
  //   });
  // }, [selectedServiceType, serviceTypes]);

  useEffect(() => {
    if (!serviceTypes || !selectedServiceType) return;

    const selected = serviceTypes.find(
      (type) => type.id == selectedServiceType,
    );

    if (!selected) return;
    const now = new Date();

    startTransition(() => {
      const isDealine = now > selected.deadline;

      if (isDealine || selected.status === "CLOSED") {
        setIsServiceAvailable(true);
        setServiceTitle(selected.name);
      }
    });
  }, [selectedServiceType, serviceTypes]);

  useEffect(() => {
    startTransition(async () => {
      const { error, serviceTypes } = await getServiceTypes();

      if (error) {
        toast.error(error);
        return;
      }

      if (serviceTypes) {
        setServiceTypes(
          serviceTypes.map((s) => ({
            ...s,
            status: s.status as FEE_PAYMENT_STATUS,
          })),
        );
      }
    });
  }, []);

  const currentServiceName =
    serviceTypes && selectedServiceType
      ? (serviceTypes.find((s) => s.id === selectedServiceType)?.name ?? "")
      : "";

  const handleSubmit = (value: VerifyStudentType) => {
    startTransition(async () => {
      const { error, placedStudent, student } = await getPlaceStudentByIndex({
        ...value,
        serviceName: currentServiceName,
      });

      if (error) {
        toast.error(error);
        return;
      } else if (placedStudent) {
        toast.success("Student verified");

        if (placedStudent.isAcceptancePaid && !placedStudent.isFormSubmitted) {
          router.push(`/online-admissions/enrollment/${placedStudent.id}`);
        } else if (
          placedStudent.isAcceptancePaid &&
          placedStudent.isFormSubmitted
        ) {
          router.push(
            `/online-admissions/admission-documents?success=true&admissionId=${placedStudent.id}`,
          );
        } else {
          router.push(
            `/online-admissions/initiate-payment?studentId=${placedStudent.jhsIndexNumber}&service_type_Id=${value.paymentType}&service_name=${currentServiceName}`,
          );
        }
      } else if (student) {
        if (student.isPaymentAccepted) {
          router.push(
            `/online-payments/payment-summary?studentId=${student.studentNumber}&service_type_Id=${value.paymentType}&service_name=${currentServiceName}`,
          );
        } else {
          router.push(
            `/online-admissions/initiate-payment?studentId=${student.studentNumber}&service_type_Id=${value.paymentType}&service_name=${currentServiceName}`,
          );
        }
      }
    });
  };

  const handleReset = () => {
    setIsServiceAvailable(false);
    form.reset({
      paymentType: "",
      studentId: "",
      serviceName: "",
    });
  };

  const isReady = !!selectedServiceType && !!studentId;

  return (
    <>
      {!isServiceAvailable ? (
        <Card className="w-full md:min-w-lg shadow-lg border-t-4 border-t-primary">
          <CardHeader className="border-b pb-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/25">
                <ShieldCheck className="size-3" />
                Step 1 of 5 &mdash; Identity Verification
              </span>
            </div>
            <CardTitle className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent mb-2">
              {new Date().getFullYear()} Online Admission Process
            </CardTitle>
            <CardDescription className="bg-primary/5 border rounded-lg p-3 font-mono text-justify text-xs leading-relaxed">
              Kindly enter the student&apos;s BECE index number into the input
              field below and click the button to verify the existence of the
              student&apos;s records. If the student exists, you will be
              automatically redirected to the next step in the admission
              process.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-5">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-5">
                <ModernInputWithLabel
                  name="studentId"
                  fieldTitle="Index Number"
                  showFocusRing={true}
                  placeholder="Enter Index number here"
                  schema={VerifyStudentSchema}
                />
                <GenericSelectWithLabel<VerifyStudentType>
                  name="paymentType"
                  fieldTitle="Service Type"
                  schema={VerifyStudentSchema}
                  data={serviceTypes ?? []}
                  valueKey="id"
                  selectedKey="name"
                  className="min-h-11.5 shadow-lg hover:bg-linear-120 from-primary/5 to-inherit"
                />

                <LoadingButton
                  className="h-11 w-full"
                  disabled={!isReady}
                  loading={isPending}>
                  {isPending ? (
                    <>
                      <Loader className="size-4 animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4 mr-2" />
                      Verify Student
                    </>
                  )}
                </LoadingButton>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full md:min-w-lg shadow-lg border-t-4 border-t-primary">
          <CardHeader className="border-b">
            <CardTitle className="flex space-x-2 items-center mb-3">
              <span className="flex justify-center items-center size-10 p-1.5 rounded-full bg-destructive/30">
                <TriangleAlert className="size-6 text-destructive" />
              </span>
              <h1 className="text-xl font-bold bg-linear-90 from-destructive to-primary text-transparent bg-clip-text">
                {serviceTitle} Payment Closed!
              </h1>
            </CardTitle>
            <CardDescription className="bg-destructive/20 border border-destructive p-3 rounded-md">
              Online payment processing for the selected service has closed.
              Kindly contact the school for support.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoadingButton
              variant="destructive"
              onClick={handleReset}
              loading={false}
              type="button">
              <ArrowLeft className="size-4" />
              Go Back
            </LoadingButton>
          </CardContent>
        </Card>
      )}
    </>
  );
};
