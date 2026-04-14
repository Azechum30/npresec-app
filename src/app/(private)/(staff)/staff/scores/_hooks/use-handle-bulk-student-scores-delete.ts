import { useTransition, useState, useMemo } from "react";
import { handleBulkStudentScoreDeleteAction } from "../_actions/handle-bulk-student-scores-delete-action";
import { useSearchParams } from "next/navigation";

export const useHandleBulkStudentScoresDelete = () => {
  const [isDeleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const searchParams = useSearchParams();
  const queryParams = useMemo(() => {
    return {
      classID: searchParams.get("classID") || "",
      courseID: searchParams.get("courseID") || "",
      semester: searchParams.get("semester") || "",
      academicYear: searchParams.get("academicYear") || "",
      assessmentType: searchParams.get("assessmentType") || "",
    };
  }, [searchParams]);

  const handleBulkStudentScoresDelete = async (ids: string[]) => {
    startDeleteTransition(async () => {
      const { error, deleteCount } = await handleBulkStudentScoreDeleteAction(
        ids,
        queryParams
      );
      if (error) {
        setDeleteError(error);
        setDeleteSuccess(false);
        setRecordCount(0);
        return;
      }
      if (!deleteCount) {
        setDeleteError("");
        setDeleteSuccess(false);
        setRecordCount(0);
        return;
      }
      setDeleteError("");
      setDeleteSuccess(true);
      setRecordCount(deleteCount || 0);
    });
  };
  return {
    handleBulkStudentScoresDelete,
    isDeleting,
    deleteError,
    deleteSuccess,
    recordCount,
  };
};
