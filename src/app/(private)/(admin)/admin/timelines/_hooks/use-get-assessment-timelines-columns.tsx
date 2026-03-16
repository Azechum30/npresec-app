import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { AssessmentTimelinesResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDeleteTimelineById } from "./use-delete-timeline-by-id";

export const useGetAssessmentTimelinesColumns = () => {
  const { handleDeleteTimelineById, isPending, error, success } =
    useDeleteTimelineById();

  const errorRef = useRef<boolean | null>(null);
  const successRef = useRef<boolean | null>(null);

  useEffect(() => {
    const wasError = errorRef.current;

    if (wasError && !isPending && error) {
      toast.error(error);
    }

    errorRef.current = isPending;
  }, [error, isPending]);

  useEffect(() => {
    const wasError = errorRef.current;

    if (wasError && !isPending && error) {
      toast.error(error);
    }

    errorRef.current = isPending;
  }, [error, isPending]);

  useEffect(() => {
    const wasSuccess = successRef.current;

    if (wasSuccess && !isPending && success) {
      toast.success("Timeline deleted successfully");
    }

    successRef.current = isPending;
  }, [success, isPending]);

  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableGrouping: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
    {
      id: "courseTitle",
      header: "CourseTitle",
      accessorFn: (row) => row.course.title,
    },
    {
      header: "Semester",
      accessorFn: (row) => row.semester,
    },

    {
      header: "Year",
      accessorFn: (row) => row.academicYear,
    },
    {
      header: "Type",
      accessorFn: (row) => row.assessmentType,
    },

    {
      header: "StartDate",
      accessorFn: (row) =>
        new Intl.DateTimeFormat("en-GH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(row.startDate),
    },
    {
      header: "EndDate",
      accessorFn: (row) =>
        new Intl.DateTimeFormat("en-GH", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(row.endDate),
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-assessment-timeline"
          onDelete={async () => handleDeleteTimelineById(row.original.id)}
          isPending={isPending}
        />
      ),

      enableColumnFilter: false,
      enableGrouping: false,
      enableGlobalFilter: false,
      enableHiding: false,
      enableMultiSort: false,
      enablePinning: false,
      enableResizing: false,
      enableSorting: false,
    },
  ] satisfies ColumnDef<AssessmentTimelinesResponseType>[];
};
