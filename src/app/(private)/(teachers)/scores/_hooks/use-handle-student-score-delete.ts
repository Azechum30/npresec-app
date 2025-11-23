import { useTransition, useState } from "react";
import { handleStudentScoreDeleteAction } from "../_actions/handle-student-score-delete";

export const useHandleStudentScoreDelete = () => {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  const handleStudentScoreDelete = (id: string) => {
    startDeleteTransition(async () => {
      const { error, studentScore } = await handleStudentScoreDeleteAction(id);
      if (error) {
        setDeleteError(error);
        setDeleteSuccess(false);
        return;
      }
      if (!studentScore) {
        setDeleteError("");
        setDeleteSuccess(false);
        return;
      }
      setDeleteError("");
      setDeleteSuccess(true);
    });
  };

  return { handleStudentScoreDelete, isDeleting, deleteError, deleteSuccess };
};
