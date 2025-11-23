"use client";

import DataTable from "@/components/customComponents/data-table";
import { GradeResponseType } from "@/lib/types";
import { toast } from "sonner";
import { useGetScoresColumns } from "../_hooks/use-get-scores-columns";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { StudentScoreDetail } from "./StudentScoreDetail";
import { useHandleBulkStudentScoresDelete } from "../_hooks/use-handle-bulk-student-scores-delete";
import { useEffect, useRef } from "react";
import { studentScoresTransformer } from "../_utils/student-scores-transformer";
type RenderScoresTableProps = {
  scores?: GradeResponseType[];
  error?: string;
};

export const RenderScoresTable = ({
  scores,
  error,
}: RenderScoresTableProps) => {
  const columns = useGetScoresColumns();
  const {
    handleBulkStudentScoresDelete,
    isDeleting,
    deleteError,
    deleteSuccess,
    recordCount,
  } = useHandleBulkStudentScoresDelete();

  const prevErrorRef = useRef(false);
  useEffect(() => {
    const wasError = prevErrorRef.current;
    if (wasError && !isDeleting && deleteError) {
      toast.error(deleteError);
    }
    prevErrorRef.current = isDeleting;
  }, [isDeleting, deleteError]);

  useEffect(() => {
    if (deleteSuccess && !isDeleting) {
      toast.success(`${recordCount} scores were deleted`);
    }
  }, [deleteSuccess, isDeleting, recordCount]);

  return (
    <>
      {scores === undefined && error === undefined ? (
        <div className="flex items-center justify-center py-8 w-full  h-full max-h-svh">
          <p className="text-muted-foreground">
            Please select a class to view students scores
          </p>
        </div>
      ) : error ? (
        <ErrorComponent error={error} />
      ) : scores && scores.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">
            No students found in the selected class
          </p>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={scores ?? []}
          filename="Student-Scores-List"
          transformer={studentScoresTransformer}
          renderSubComponent={(row) => <StudentScoreDetail row={row} />}
          onDelete={async (rows) => {
            const ids = rows.map((r) => r.original.id);
            await handleBulkStudentScoresDelete(ids);
          }}
        />
      )}
    </>
  );
};
