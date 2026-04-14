import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { SingleStudentScoreType } from "@/lib/validation";
import { useState, useTransition } from "react";
import { handleUpdateStudentScoreAction } from "../_actions/handle-update-student-score-action";

export const useHandleStudentScoreUpdate = () => {
  const [isUpdating, startUpdateTransition] = useTransition();
  const [updateError, setUpdateError] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { id } = useGenericDialog();

  const handleStudentScoreUpdate = (data: SingleStudentScoreType) => {
    startUpdateTransition(async () => {
      const { error, studentScore } = await handleUpdateStudentScoreAction({
        dataValues: data,
        id: id as string,
      });

      if (error) {
        setUpdateError(error);
        setUpdateSuccess(false);
        return;
      }

      if (!studentScore) {
        setUpdateError("");
        setUpdateSuccess(false);
        return;
      }
      setUpdateError("");
      setUpdateSuccess(true);
    });
  };
  return { handleStudentScoreUpdate, isUpdating, updateError, updateSuccess };
};
