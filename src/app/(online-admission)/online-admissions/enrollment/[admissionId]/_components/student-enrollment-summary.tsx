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
    <div className="space-y-6 print:space-y-1 rounded-md border p-4 print:overflow-hidden max-h-[60vh] overflow-y-auto scrollbar-thin">
      <h1 className="print:text-black text-base font-semibold tracking-tight bg-linear-180 from-primary to-muted-foreground text-transparent bg-clip-text mb-3 print:mb-0">
        Section E: Enrollment Summary
      </h1>
      <fieldset className="p-3 border rounded-md space-y-5 print:space-y-2">
        <legend className="print:text-black bg-linear-90 from-destructive to-primary bg-clip-text text-transparent p-1.5 font-semibold text-base">
          Bio Data
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Surname:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.bioData.lastName}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Other Names:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.bioData.otherNames}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Date of Birth:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {new Intl.DateTimeFormat("en-GH", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }).format(new Date(summaryData.bioData.birthDate))}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Gender:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.bioData.gender.charAt(0).toUpperCase() +
                summaryData.bioData.gender.slice(1)}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Phone Number:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.bioData.phone ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Email:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.bioData.email}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Hometown:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.bioData.hometown ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Address:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.bioData.primaryAddress}
            </span>
          </div>
        </div>
      </fieldset>
      <fieldset className="p-3 border rounded-md space-y-5">
        <legend className="bg-linear-90 from-destructive to-primary bg-clip-text text-transparent p-1.5 font-semibold text-base">
          Academic History (Previous School)
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Enrollment Code:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.academicHistory.enrollmentCode}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">BECE Index Number:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.academicHistory.jhsIndexNumber}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">JHS Attended:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.academicHistory.jhsAttended}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Aggregate Score:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.academicHistory.aggregateScore ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">School Loacation:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.academicHistory.schoolLocation ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">District:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.academicHistory.district ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Region:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.academicHistory.schoolRegion ?? "N/A"}
            </span>
          </div>
        </div>
      </fieldset>
      <fieldset className="p-3 border rounded-md space-y-5">
        <legend className="bg-linear-90 from-destructive to-primary bg-clip-text text-transparent p-1.5 font-semibold text-base">
          Parent or Guardian Data
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">
              Name of Parent/Guardian:
            </span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.parentOrGuardianInfo.guardianName ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Guardian Contact:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.parentOrGuardianInfo.guardianPhoneNumber}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">
              Relationship Student:
            </span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.parentOrGuardianInfo.guardianRelation ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">
              Guardian Email (If any):
            </span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.parentOrGuardianInfo.guardianEmail ?? "N/A"}
            </span>
          </div>
        </div>
      </fieldset>
      <fieldset className="p-3 border rounded-md space-y-5">
        <legend className="bg-linear-90 from-destructive to-primary bg-clip-text text-transparent p-1.5 font-semibold text-base">
          Programme or Course Selection
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 print:gap-3">
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Programme:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.programmeSelection.programme ?? "N/A"}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-semibold flex-1/4">Chosen Class:</span>
            <span className="border rounded-md p-2 flex-3/4">
              {summaryData.programmeSelection.className}
            </span>
          </div>
        </div>
      </fieldset>
      <fieldset className="print:hidden bg-lime-400/10 p-3 border rounded-md space-y-5">
        <legend className="bg-linear-90 from-lime-500 to-primary bg-clip-text text-transparent p-1.5 font-semibold text-base">
          Declaration and Consent
        </legend>
        <div className="grid grid-cols-1 gap-6">
          <div className="flex items-start gap-2">
            <Checkbox
              checked={isAgreed}
              onCheckedChange={() => setIsAgreed((prev) => !prev)}
              className="size-5 border-primary"
              id="consent"
            />
            <Label htmlFor="consent" className="text-justify leading-normal">
              I hereby certify that all information provided in this form is
              accurate, complete, and true to the best of my knowledge. I
              understand and agree that any misrepresentation, omission, or
              false statement discovered at any stage may result in the
              immediate forfeiture of my admission and enrollment. By submitting
              this form, I acknowledge that I have read and agree to the Terms
              of Service and Privacy Policy regarding the collection and
              processing of my personal data.
            </Label>
          </div>
        </div>
      </fieldset>

      <div className="print:hidden border-t mt-6 py-5 gap-3 flex flex-col sm:flex-row sm:justify-end sm:items-center">
        <LoadingButton
          onClick={() => prevStep()}
          type="button"
          className="w-full sm:w-1/4"
          loading={false}
          variant="outline">
          <ChevronLeft className="size-5" />
          Go Back
        </LoadingButton>
        <LoadingButton
          type="button"
          onClick={handleSubmission}
          className="w-full sm:w-1/4"
          disabled={!isAgreed}
          loading={isPending}>
          {isPending ? <>Submitting...</> : <>Submit</>}
        </LoadingButton>
      </div>
    </div>
  );
};
