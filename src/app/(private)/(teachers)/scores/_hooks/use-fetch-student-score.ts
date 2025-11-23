import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { GradeResponseType } from "@/lib/types";
import { useState, useTransition, useEffect } from "react";
import { getStudentScoreAction } from "../_actions/get-student-score";

export const useFetchStudentScore = () => {
  const [studentScore, setStudentScore] = useState<
    GradeResponseType | undefined
  >(undefined);
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);
  const [fetchSuccess, setFetchSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const { id } = useGenericDialog();

  useEffect(() => {
    if (!id) return;
    setStudentScore(undefined);
    setFetchError(undefined);
    setFetchSuccess(false);

    startTransition(async () => {
      const { error, studentScore } = await getStudentScoreAction(id as string);
      if (error) {
        setFetchError(error);
        setFetchSuccess(false);
        return;
      }

      if (!studentScore) {
        setFetchError(undefined);
        setFetchSuccess(false);
        return;
      }
      setFetchError(undefined);
      setFetchSuccess(true);
      setStudentScore(studentScore);
    });
  }, [id]);

  return { studentScore, fetchError, fetchSuccess, isPending };
};
