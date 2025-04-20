"use client";
import { useParams } from "next/navigation";
import StudentOnboardingNavbar from "../../components/studentsOnboardingNavbar";
import PersonalInfoForm from "../../forms/personal-info-form";
import { useStudentStore } from "../../store";
import { useEffect, useTransition } from "react";
import { getStudent } from "../../actions/action";
import AcademicInfoForm from "../../forms/academic-info-form";
import GuardianInfoForm from "../../forms/guardian-info-form";
import ReviewAndSubmit from "../../components/review-and-submit";
import LoadingState from "@/components/customComponents/Loading";

type Params = {
  id: string;
};

export default function StudentEditPage() {
  const param: Params = useParams();
  const [isPending, startTransition] = useTransition();

  const {
    currentStep,
    actions: { loadStudentData },
  } = useStudentStore();
  useEffect(() => {
    const fetchStudent = () => {
      startTransition(async () => {
        const promiseResult = await getStudent(param.id);

        if (!promiseResult.error && promiseResult.student) {
          const { student } = promiseResult;
          loadStudentData({
            ...student,
            email: student.user?.email as string,
          });
        }
      });
    };

    fetchStudent();
  }, [param.id, loadStudentData]);

  if (isPending) {
    return <LoadingState />;
  }

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
