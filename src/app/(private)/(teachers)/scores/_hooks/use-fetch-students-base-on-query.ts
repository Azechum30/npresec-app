import { useState, useEffect, useTransition, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { StudentResponseType } from "@/lib/types";
import { fetchStudentBaseOnQueryAction } from "../_actions/fetch-stuents-base-on-query";

export const useFetchStudentsBaseOnQuery = () => {
  const [students, setStudents] = useState<StudentResponseType[] | undefined>();
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();

  const queryParams = useMemo(() => {
    return {
      classId: searchParams.get("classID") || "",
      courseId: searchParams.get("courseID") || "",
      semester: searchParams.get("semester") || "",
      academicYear: searchParams.get("academicYear") || "",
      assessmentType: searchParams.get("assessmentType") || "",
    };
  }, [searchParams]);

  useEffect(() => {
    const { classId, courseId, semester, academicYear, assessmentType } =
      queryParams;
    const allParamsPresent =
      classId && courseId && semester && academicYear && assessmentType;

    if (!allParamsPresent) return;

    setStudents(undefined);
    setFetchError(undefined);
    setFetchSuccess(false);

    startTransition(async () => {
      const res = await fetchStudentBaseOnQueryAction(
        classId,
        courseId,
        semester,
        academicYear,
        assessmentType
      );

      if (res?.error) {
        setFetchError(res.error);
        setFetchSuccess(false);
        return;
      }

      if (!res?.students) {
        setFetchError(undefined);
        setFetchSuccess(false);
        return;
      }

      setFetchError(undefined);
      setFetchSuccess(true);
      setStudents(res.students);
    });
  }, [searchParams]);

  return { students, fetchError, fetchSuccess, isPending, setStudents };
};
