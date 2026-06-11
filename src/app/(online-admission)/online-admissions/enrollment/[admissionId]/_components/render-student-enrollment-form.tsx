"use client";
import { ShowLoadingState } from "@/components/customComponents/show-loading-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CheckCheck, Form } from "lucide-react";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { getAdmittedStudent } from "../_actions/get-admitted-student";
import { AcademicHistoryForm } from "../_forms/academic-history-form";
import { BioDataForm } from "../_forms/bio-data-form";
import { ParentOrGuardianForm } from "../_forms/parent-or-guardian-form";
import { ProgrammeSelectionForm } from "../_forms/programme-selection-form";
import { useStudentEnrollmentStore } from "../_utils/store";
import { StudentEnrollmentSummary } from "./student-enrollment-summary";

const STEPS = [
  { label: "Bio Data", shortLabel: "Bio" },
  { label: "Academic", shortLabel: "Acad" },
  { label: "Guardian", shortLabel: "Guard" },
  { label: "Programme", shortLabel: "Prog" },
  { label: "Review", shortLabel: "Rev" },
];

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
        <Card className="bg-linear-60 from-primary/5 to-secondary/5 w-full md:max-w-2xl max-h-full print:w-auto print:static shadow-lg border-t-4 border-t-primary">
          <CardHeader className="border-b">
            {/* Step progress bar */}
            <div className="flex items-center justify-between mb-5 print:hidden">
              {STEPS.map((step, index) => {
                const stepNum = index + 1;
                const isCompleted = currentStep > stepNum;
                const isCurrent = currentStep === stepNum;
                return (
                  <div key={step.label} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1">
                      <div
                        className={cn(
                          "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                          isCompleted &&
                            "bg-primary text-primary-foreground",
                          isCurrent &&
                            "bg-primary text-primary-foreground ring-4 ring-primary/20",
                          !isCompleted &&
                            !isCurrent &&
                            "bg-muted text-muted-foreground border-2 border-border",
                        )}>
                        {isCompleted ? (
                          <CheckCheck className="size-4" />
                        ) : (
                          stepNum
                        )}
                      </div>
                      <span
                        className={cn(
                          "text-[9px] font-semibold uppercase tracking-wide hidden sm:block",
                          isCurrent
                            ? "text-primary"
                            : isCompleted
                              ? "text-primary/70"
                              : "text-muted-foreground",
                        )}>
                        {step.shortLabel}
                      </span>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 flex-1 mx-1 transition-all duration-500",
                          currentStep > stepNum ? "bg-primary" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <CardTitle className="mb-2 flex items-center gap-3">
              <span className="size-10 flex justify-center items-center print:border-black rounded-full bg-primary/10 shrink-0">
                <Form className="size-5 print:text-black" />
              </span>
              <h1 className="print:text-black text-lg font-bold bg-linear-to-r from-primary to-muted-foreground bg-clip-text text-transparent tracking-tight">
                Enrollment Form
              </h1>
            </CardTitle>
            <CardDescription className="print:hidden p-3 bg-primary/5 rounded-lg border text-justify font-mono text-xs leading-relaxed">
              This is the final step in the admission process. Kindly complete
              all sections. The form is divided into sections and you must fill
              in all required fields.
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
