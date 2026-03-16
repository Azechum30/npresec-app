"use client";

import DataTable from "@/components/customComponents/data-table";
import { ErrorComponent } from "@/components/customComponents/ErrorComponent";
import { NoDataFound } from "@/components/customComponents/no-data-found";
import { AssessmentTimelinesResponseType } from "@/lib/types";
import { FC, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDeleteTimelinesByIds } from "../_hooks/use-delete-timelines-by-ids";
import { useGetAssessmentTimelinesColumns } from "../_hooks/use-get-assessment-timelines-columns";

type Props = {
  data?: AssessmentTimelinesResponseType[];
  error?: string;
};

export const RenderAssessmentTimelinesTable: FC<Props> = ({ data, error }) => {
  const columns = useGetAssessmentTimelinesColumns();
  const {
    handleDeleteTimelinesByIds,
    error: deleteError,
    isPending,
    success,
    count,
  } = useDeleteTimelinesByIds();

  const errorRef = useRef<boolean | null>(null);
  const successRef = useRef<boolean | null>(null);

  useEffect(() => {
    const wasError = errorRef.current;
    if (wasError && !isPending && deleteError) {
      toast.error(deleteError);
    }
    errorRef.current = isPending;
  }, [deleteError, isPending]);

  useEffect(() => {
    const wasSuccess = successRef.current;
    if (wasSuccess && !isPending && success && count) {
      toast.success(`${count} timeline(s) was/were deleted`);
    }
    successRef.current = isPending;
  }, [success, isPending, count]);

  return (
    <>
      {error && <ErrorComponent error={error} />}

      {data && data.length > 0 ? (
        <DataTable
          columns={columns}
          data={data}
          onDelete={async (rows) => {
            const ids = rows.map((row) => row.original.id);
            handleDeleteTimelinesByIds(ids);
          }}
        />
      ) : (
        <NoDataFound />
      )}
    </>
  );
};
