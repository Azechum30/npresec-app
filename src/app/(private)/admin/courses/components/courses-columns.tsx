import { CourseResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { useDeleteCourse } from "../hooks/use-delete-course";
import { GenericActions } from "@/components/customComponents/GenericActions";

export const useGetCourseColumns = () => {
  const { deletecourse } = useDeleteCourse();
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections table={table} isHeader />,
      cell: ({ row }) => <RowSelections row={row} isHeader={false} />,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },

    {
      header: "Code",
      accessorKey: "code",
    },
    {
      header: "Title",
      accessorKey: "title",
    },
    {
      header: "Credits",
      accessorKey: "credits",
    },
    {
      header: "CreatedAt",
      cell: ({ row }) => {
        return moment(row.original.createdAt).format("DD-MM-YY");
      },
    },

    {
      header: "Department",
      cell: ({ row }) => {
        return row.original.departments
          .map((department) => (department.name ? department.name : ""))
          .join(", ");
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            row={row}
            onDelete={deletecourse}
            secondaryKey="code"
            dialogId="editCourse"
          />
        );
      },
    },

    {
      id: "expansion",
      header: ({ table }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.toggleAllRowsExpanded()}>
            {table.getIsAllRowsExpanded() ? (
              <Minus className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
          </Button>
        );
      },

      cell: ({ row }) => {
        return (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => row.toggleExpanded()}>
            {row.getIsExpanded() ? (
              <Minus className="size-5" />
            ) : (
              <Plus className="size-5" />
            )}
          </Button>
        );
      },
    },
  ] satisfies ColumnDef<CourseResponseType>[];
};
