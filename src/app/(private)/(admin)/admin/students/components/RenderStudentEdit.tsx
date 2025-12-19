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
import { DataTableSkeleton } from "@/components/customComponents/DataTable-Skeleton";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

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
          const { image } = student.user ?? {};
          const isValid = image
            ? image.startsWith("http") ||
              image.startsWith("https") ||
              image.startsWith("/")
            : false;
          const url = isValid ? image : "/no-avatar.jpg";
          loadStudentData({
            ...student,
            email: student.user?.email as string,
            photoURL: url,
          });
        }
      });
    };

    fetchStudent();
  }, [studentId, loadStudentData]);

  if (isPending) {
    return <FallbackComponent />;
  }

  return (
    <div className="flex-4">
      {currentStep === 1 && <PersonalInfoForm />}
      {currentStep === 2 && <AcademicInfoForm />}
      {currentStep === 3 && <GuardianInfoForm />}
      {currentStep === 4 && <ReviewAndSubmit />}
    </div>
  );
};
