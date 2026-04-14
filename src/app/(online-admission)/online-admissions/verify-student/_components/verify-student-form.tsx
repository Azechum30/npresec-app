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
import { VerifyStudentSchema, VerifyStudentType } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getPlaceStudentByIndex } from "../_actions/get-placed-student-by-index";

export const VerifyStudentForm = () => {
  const form = useForm<VerifyStudentType>({
    mode: "onChange",
    resolver: zodResolver(VerifyStudentSchema),
    defaultValues: {
      jhsIndexNumber: "",
    },
  });

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = (value: VerifyStudentType) => {
    startTransition(async () => {
      const { error, placedStudent } = await getPlaceStudentByIndex(value);

      if (error) {
        toast.error(error);
        return;
      }

      if (placedStudent) {
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
            `/online-admissions/initiate-payment?studentId=${placedStudent.jhsIndexNumber}`,
          );
        }
      }
    });
  };

  return (
    <Card className="w-full md:min-w-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-xl font-bold tracking-tight bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent mb-3 ">
          {new Date().getFullYear()} Online Admission Process
        </CardTitle>
        <CardDescription className="bg-primary/5 border rounded-md p-2 font-mono text-justify">
          Kindly enter the student&apos;s BECE index number into the input field
          below and click on the button to verify the existence of the
          student&apos;s records. If the student exists, you will be
          automatically redirected to a payment page where you are expected to
          make the necessary payment before you proceed with the rest of the
          admission process.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="border p-4 space-y-6">
            <ModernInputWithLabel
              name="jhsIndexNumber"
              fieldTitle="BECE Index Number"
              showFocusRing={true}
              placeholder="Enter JHS Index number here"
              schema={VerifyStudentSchema}
            />
            <LoadingButton
              className="h-12"
              disabled={!form.formState.isValid}
              loading={isPending}>
              {isPending ? (
                <>
                  <Loader className="size-5 animate-spin mr-2 " />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle2 />
                  Verify
                </>
              )}
            </LoadingButton>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
