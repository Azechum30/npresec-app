"use client";
import ReviewAndSubmit from "../components/review-and-submit";
import StudentOnboardingNavbar from "../components/studentsOnboardingNavbar";
import AcademicInfoForm from "../forms/academic-info-form";
import GuardianInfoForm from "../forms/guardian-info-form";
import PersonalInfoForm from "../forms/personal-info-form";
import { useCurrentStep } from "../store";

export default function StudentOnboardingPage() {
  const currentStep = useCurrentStep();
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <StudentOnboardingNavbar className="flex-[1] sticky top-16 h-full mb-10 md:mb-0 bg-background p-4 md:p-0 rounded-md md:rounded-none" />
      <div className="flex-[4]">
        {currentStep === 1 && <PersonalInfoForm />}
        {currentStep === 2 && <AcademicInfoForm />}
        {currentStep === 3 && <GuardianInfoForm />}
        {currentStep === 4 && <ReviewAndSubmit />}
      </div>
    </div>
  );
}
