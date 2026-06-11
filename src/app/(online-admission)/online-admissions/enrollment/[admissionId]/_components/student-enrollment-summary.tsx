"use client";

import LoadingButton from "@/components/customComponents/LoadingButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { updateAndCreateStudentRecord } from "../_actions/update-and-create-student-record";
import { useStudentEnrollmentStore } from "../_utils/store";

const SummaryField = ({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide print:text-black print:text-xs">
      {label}
    </span>
    <span className="rounded-lg bg-muted/40 border px-3 py-2 text-sm print:border-black print:rounded-none print:bg-transparent">
      {value ?? "N/A"}
    </span>
  </div>
);

const SectionHeader = ({
  title,
  color = "bg-primary",
}: {
  title: string;
  color?: string;
}) => (
  <div className="flex items-center gap-2 mb-1">
    <span className={`size-2 rounded-full shrink-0 ${color} print:hidden`} />
    <span className="text-sm font-bold tracking-tight print:text-black">
      {title}
    </span>
  </div>
);

export const StudentEnrollmentSummary = () => {
  const {
    actions: { getData, prevStep, resetForm },
  } = useStudentEnrollmentStore();

  const [isAgreed, setIsAgreed] = useState(false);
  const summaryData = getData();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmission = () => {
    startTransition(async () => {
      const { error, success, admissionId } =
        await updateAndCreateStudentRecord({
          ...summaryData.academicHistory,
          ...summaryData.bioData,
          ...summaryData.parentOrGuardianInfo,
          ...summaryData.programmeSelection,
        });

      if (error) {
        toast.error(error);
        return;
      }

      if (success && admissionId) {
        toast.success(
          "Student admitted successfully. Your data is currently been prepared for your class allocation",
        );
        resetForm();

        router.push(
          `/online-admissions/admission-documents?success=true&admissionId=${admissionId}` as Route,
        );
      }
    });
  };

  return (
    <div className="space-y-5 print:space-y-1 rounded-lg border p-4 print:overflow-hidden max-h-[60vh] overflow-y-auto scrollbar-thin">
      <h1 className="print:text-black text-base font-semibold tracking-tight bg-linear-180 from-primary to-muted-foreground text-transparent bg-clip-text print:mb-0">
        Section E: Enrollment Summary
      </h1>

      {/* Bio Data */}
      <fieldset className="rounded-xl border-2 p-4 space-y-4 print:space-y-2 print:rounded-none print:border print:p-2">
        <legend className="px-2 -ml-1">
          <SectionHeader title="Bio Data" color="bg-primary" />
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField label="Surname" value={summaryData.bioData.lastName} />
          <SummaryField
            label="Other Names"
            value={summaryData.bioData.otherNames}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="Date of Birth"
            value={new Intl.DateTimeFormat("en-GH", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            }).format(new Date(summaryData.bioData.birthDate))}
          />
          <SummaryField
            label="Gender"
            value={
              summaryData.bioData.gender.charAt(0).toUpperCase() +
              summaryData.bioData.gender.slice(1)
            }
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="Phone Number"
            value={summaryData.bioData.phone ?? "N/A"}
          />
          <SummaryField label="Email" value={summaryData.bioData.email} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="Hometown"
            value={summaryData.bioData.hometown ?? "N/A"}
          />
          <SummaryField
            label="Address"
            value={summaryData.bioData.primaryAddress}
          />
        </div>
      </fieldset>

      {/* Academic History */}
      <fieldset className="rounded-xl border-2 p-4 space-y-4 print:space-y-2 print:rounded-none print:border print:p-2">
        <legend className="px-2 -ml-1">
          <SectionHeader
            title="Academic History (Previous School)"
            color="bg-destructive"
          />
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="Enrollment Code"
            value={summaryData.academicHistory.enrollmentCode}
          />
          <SummaryField
            label="BECE Index Number"
            value={summaryData.academicHistory.jhsIndexNumber}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="JHS Attended"
            value={summaryData.academicHistory.jhsAttended}
          />
          <SummaryField
            label="Aggregate Score"
            value={summaryData.academicHistory.aggregateScore ?? "N/A"}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="School Location"
            value={summaryData.academicHistory.schoolLocation ?? "N/A"}
          />
          <SummaryField
            label="District"
            value={summaryData.academicHistory.district ?? "N/A"}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 print:gap-2">
          <SummaryField
            label="Region"
            value={summaryData.academicHistory.schoolRegion ?? "N/A"}
          />
        </div>
      </fieldset>

      {/* Parent / Guardian */}
      <fieldset className="rounded-xl border-2 p-4 space-y-4 print:space-y-2 print:rounded-none print:border print:p-2">
        <legend className="px-2 -ml-1">
          <SectionHeader
            title="Parent or Guardian Data"
            color="bg-accent-foreground"
          />
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="Name of Parent/Guardian"
            value={summaryData.parentOrGuardianInfo.guardianName ?? "N/A"}
          />
          <SummaryField
            label="Guardian Contact"
            value={summaryData.parentOrGuardianInfo.guardianPhoneNumber}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="Relationship to Student"
            value={summaryData.parentOrGuardianInfo.guardianRelation ?? "N/A"}
          />
          <SummaryField
            label="Guardian Email"
            value={summaryData.parentOrGuardianInfo.guardianEmail ?? "N/A"}
          />
        </div>
      </fieldset>

      {/* Programme */}
      <fieldset className="rounded-xl border-2 p-4 space-y-4 print:space-y-2 print:rounded-none print:border print:p-2">
        <legend className="px-2 -ml-1">
          <SectionHeader
            title="Programme or Course Selection"
            color="bg-chart-2"
          />
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 print:gap-2">
          <SummaryField
            label="Programme"
            value={summaryData.programmeSelection.programme ?? "N/A"}
          />
          <SummaryField
            label="Chosen Class"
            value={summaryData.programmeSelection.className}
          />
        </div>
      </fieldset>

      {/* Declaration and Consent */}
      <fieldset className="print:hidden rounded-xl border-2 border-green-500/30 bg-green-500/5 p-4 space-y-4">
        <legend className="px-2 -ml-1">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500 shrink-0" />
            <span className="text-sm font-bold text-green-700 dark:text-green-400 tracking-tight">
              Declaration and Consent
            </span>
          </div>
        </legend>
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isAgreed}
            onCheckedChange={() => setIsAgreed((prev) => !prev)}
            className="size-5 border-primary mt-0.5 shrink-0"
            id="consent"
          />
          <Label
            htmlFor="consent"
            className="text-justify leading-relaxed text-sm">
            I hereby certify that all information provided in this form is
            accurate, complete, and true to the best of my knowledge. I
            understand and agree that any misrepresentation, omission, or false
            statement discovered at any stage may result in the immediate
            forfeiture of my admission and enrollment. By submitting this form,
            I acknowledge that I have read and agree to the Terms of Service and
            Privacy Policy regarding the collection and processing of my
            personal data.
          </Label>
        </div>
      </fieldset>

      <div className="print:hidden border-t pt-5 mt-2 gap-3 flex flex-col sm:flex-row sm:justify-end sm:items-center">
        <LoadingButton
          onClick={() => prevStep()}
          type="button"
          className="w-full sm:w-auto"
          loading={false}
          variant="outline">
          <ChevronLeft className="size-4 mr-1" />
          Go Back
        </LoadingButton>
        <LoadingButton
          type="button"
          onClick={handleSubmission}
          className="w-full sm:w-auto"
          disabled={!isAgreed}
          loading={isPending}>
          {isPending ? <>Submitting...</> : <>Submit Enrollment</>}
        </LoadingButton>
      </div>
    </div>
  );
};
