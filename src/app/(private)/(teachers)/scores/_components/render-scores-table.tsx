"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { Notification } from "@/components/customComponents/notification";
import { GradeResponseType } from "@/lib/types";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useGetScoresColumns } from "../_hooks/use-get-scores-columns";
import { useHandleBulkStudentScoresDelete } from "../_hooks/use-handle-bulk-student-scores-delete";
import { studentScoresTransformer } from "../_utils/student-scores-transformer";
import { StudentScoreDetail } from "./StudentScoreDetail";
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
        <Notification description="Kindly select the class you wish to view their scores to filter and get the data returned to you in real-time. Data is cached for performance and so you may be served with stale data. No worries, the server revalidates from time-to-time and if there is an on-demand need to purge the cache." />
      ) : error ? (
        <ErrorComponent error={error} />
      ) : scores && scores.length === 0 ? (
        <Notification description="No grades were found for the selected class. It is possible, the scores are yet to be captured for the said class and you need to wait patiently." />
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
