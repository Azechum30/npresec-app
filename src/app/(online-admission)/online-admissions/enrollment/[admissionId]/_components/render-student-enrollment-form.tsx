"use client";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "lucide-react";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { getAdmittedStudent } from "../_actions/get-admitted-student";
import { AcademicHistoryForm } from "../_forms/academic-history-form";
import { BioDataForm } from "../_forms/bio-data-form";
import { ParentOrGuardianForm } from "../_forms/parent-or-guardian-form";
import { ProgrammeSelectionForm } from "../_forms/programme-selection-form";
import { useStudentEnrollmentStore } from "../_utils/store";
import { StudentEnrollmentSummary } from "./student-enrollment-summary";

export const RenderStudentEnrollementForm = ({
  admissionId,
}: {
  admissionId: string;
}) => {
  const { currentStep, actions } = useStudentEnrollmentStore();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    startTransition(async () => {
      const { error, student } = await getAdmittedStudent(admissionId);

      if (error) {
        toast.error(error);
        return;
      }

      if (student) {
        actions.setBioData({
          lastName: student.lastName,
          otherNames: student.otherNames,
          birthDate: student.birthDate,
          gender: student.gender,
          hometown: student.hometown ?? "",
          primaryAddress: student.primaryAddress ?? "",
          email: "",
        });

        actions.setAcademicHistory({
          aggregateScore: student.aggregateScore ?? 0,
          district: student.district ?? "",
          enrollmentCode: student.enrollmentCode ?? "",
          jhsAttended: student.jhsAttended,
          jhsIndexNumber: student.jhsIndexNumber,
          schoolLocation: student.schoolLocation ?? "",
          schoolRegion: student.schoolRegion ?? "",
        });

        actions.setParentOrGuardian({
          guardianPhoneNumber: student.guardianPhoneNumber ?? "",
          guardianName: student.guardianName ?? "",
          guardianRelation: student.guardianRelation ?? "",
          guardianEmail: "",
        });

        actions.setProgrammeSelection({
          programme: student.programme,
        });
      }
    });
  }, [admissionId]);

  return (
    <>
      {isPending ? (
        <ShowLoadingState />
      ) : (
        <Card className="bg-linear-60 from-primary/5 to-secondary/5 w-full md:max-w-2xl max-h-full print:w-auto print:static">
          <CardHeader className="border-b">
            <CardTitle className="mb-3 flex items-center space-x-2">
              <span className="size-12 flex justify-center items-center print:border-black rounded-full bg-primary/10">
                <Form className="size-8 print:text-black" />
              </span>
              <h1 className="print:text-black text-lg font-bold bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent tracking-tight">
                Enrollment Form
              </h1>
            </CardTitle>
            <CardDescription className="print:hidden p-3 bg-primary/5 rounded-md border text-justify font-mono">
              This is final step in the admission process. Kindly provide
              responses for the form fields that do not value. The form is
              divide into sections. You are required to fill all the sections.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentStep === 1 ? (
              <BioDataForm />
            ) : currentStep === 2 ? (
              <AcademicHistoryForm />
            ) : currentStep === 3 ? (
              <ParentOrGuardianForm />
            ) : currentStep === 4 ? (
              <ProgrammeSelectionForm />
            ) : (
              <StudentEnrollmentSummary />
            )}
          </CardContent>
        </Card>
      )}
    </>
  );
};
