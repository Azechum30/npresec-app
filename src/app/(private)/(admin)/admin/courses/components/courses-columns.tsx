/**biome-ignore-all assist/source/organizeImports: reason */
import { GenericActions } from "@/components/customComponents/GenericActions";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Button } from "@/components/ui/button";
import { useUserPreferredDateFormat } from "@/hooks/use-user-preferred-date-format";
import type { CourseResponseType } from "@/lib/types";
import type { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus } from "lucide-react";
import { useDeleteCourseMutationFn } from "../actions/mutations";

export const useGetCourseColumns = () => {
  const { isPending, mutateAsync } = useDeleteCourseMutationFn();
  const { formatDate } = useUserPreferredDateFormat();

  const handleDelete = async (id: string) => {
    Promise.try(async () => await mutateAsync(id));
  };
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
      accessorFn: (row) => formatDate(row.createdAt),
    },

    {
      header: "Department",
      cell: ({ row }) => {
        const departments = row.original.departments.map(
          (department) => department.name,
        );
        return (
          <div className="line-clamp-2">
            {departments.map((name) => (
              <div key={name}>{name}</div>
            ))}
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        return (
          <GenericActions
            row={row}
            onDelete={handleDelete}
            secondaryKey="id"
            dialogId="edit-course"
            isPending={isPending}
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
