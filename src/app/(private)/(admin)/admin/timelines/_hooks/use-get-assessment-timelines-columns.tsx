/** biome-ignore-all assist/source/organizeImports:reason */
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import type { AssessmentTimelinesResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { useDeleteAssessmentTimelineMutationFn } from "../_actions/mutations";

export const useGetAssessmentTimelinesColumns = () => {
  const { isPending, mutateAsync } = useDeleteAssessmentTimelineMutationFn();

  const handleTimelineDelete = async (id: string) => {
    await Promise.try(async () => {
      await mutateAsync(id);
    });
  };

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
          onDelete={async () => handleTimelineDelete(row.original.id)}
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
