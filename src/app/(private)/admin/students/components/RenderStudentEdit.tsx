"use client";

import LoadingState from "@/components/customComponents/Loading";
import { useEffect, useTransition } from "react";
import { getStudent } from "../actions/action";
import AcademicInfoForm from "../forms/academic-info-form";
import GuardianInfoForm from "../forms/guardian-info-form";
import PersonalInfoForm from "../forms/personal-info-form";
import { useStudentStore } from "../store";
import ReviewAndSubmit from "./review-and-submit";
import StudentOnboardingNavbar from "./studentsOnboardingNavbar";

type Props = {
  studentId: string;
};

export const RenderStudentEdit = ({ studentId }: Props) => {
  const [isPending, startTransition] = useTransition();

  const {
    currentStep,
    actions: { loadStudentData },
  } = useStudentStore();
  useEffect(() => {
    const fetchStudent = () => {
      startTransition(async () => {
        const promiseResult = await getStudent(studentId);

        if (!promiseResult.error && promiseResult.student) {
          const { student } = promiseResult;
          loadStudentData({
            ...student,
            email: student.user?.email as string,
            photoURL: student.user?.picture,
          });
        }
      });
    };

    fetchStudent();
  }, [studentId, loadStudentData]);

  if (isPending) {
    return <LoadingState />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <StudentOnboardingNavbar className="flex-1 sticky top-16 h-full mb-10 md:mb-0 bg-background p-4 md:p-0 rounded-md md:rounded-none" />
      <div className="flex-4">
        {currentStep === 1 && <PersonalInfoForm />}
        {currentStep === 2 && <AcademicInfoForm />}
        {currentStep === 3 && <GuardianInfoForm />}
        {currentStep === 4 && <ReviewAndSubmit />}
      </div>
    </div>
  );
};
