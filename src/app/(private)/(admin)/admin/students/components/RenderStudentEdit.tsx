/**biome-ignore-all assist/source/organizeImports: reason */
"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getStudentQueryOptions } from "../actions/queries";
import AcademicInfoForm from "../forms/academic-info-form";
import GuardianInfoForm from "../forms/guardian-info-form";
import PersonalInfoForm from "../forms/personal-info-form";
import { useStudentStore } from "../store";
import ReviewAndSubmit from "./review-and-submit";

type Props = {
  studentId: string;
};

export const RenderStudentEdit = ({ studentId }: Props) => {
  const {
    currentStep,
    actions: { loadStudentData },
  } = useStudentStore();

  const { data, isLoading } = useSuspenseQuery({
    ...getStudentQueryOptions(studentId),
  });

  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!data || isLoading || hasLoaded.current) return;

    const { image } = data.user ?? {};
    const isValid = image
      ? image.startsWith("http") || image.startsWith("/")
      : false;
    const url = isValid ? image : "/no-avatar.jpg";

    loadStudentData({
      ...data,
      email: data.user?.email as string,
      photoURL: url,
    });

    hasLoaded.current = true;
  }, [data, isLoading, loadStudentData]);

  return (
    <div className="flex-4">
      {currentStep === 1 && <PersonalInfoForm />}
      {currentStep === 2 && <AcademicInfoForm />}
      {currentStep === 3 && <GuardianInfoForm />}
      {currentStep === 4 && <ReviewAndSubmit />}
    </div>
  );
};
