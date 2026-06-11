import { GenericActions } from "@/components/customComponents/GenericActions";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GradeResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { useHandleStudentScoreDelete } from "./use-handle-student-score-delete";

export const useGetScoresColumns = () => {
  const { handleStudentScoreDelete, isDeleting, deleteError, deleteSuccess } =
    useHandleStudentScoreDelete();
  return [
    {
      id: "selection",
      header: ({ table }) => <RowSelections isHeader table={table} />,
      cell: ({ row }) => <RowSelections isHeader={false} row={row} />,
      enableColumnFilter: false,
      enableHiding: false,
      enableSorting: false,
      enablePinning: false,
      enableResizing: false,
    },
    {
      header: "Avatar",
      cell: ({ row }) => {
        const { image } = row.original.student.user ?? {};
        const isValid = image
          ? image.startsWith("http") ||
            image.startsWith("https") ||
            image.startsWith("/")
          : false;
        const url = isValid ? (image as string) : "/no-avatar.jpg";
        return (
          <Avatar>
            <AvatarImage src={url} alt="avatar" />
            <AvatarFallback>
              {row.original.student.lastName.charAt(0) +
                row.original.student.firstName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      header: "FirstName",
      accessorFn: (row) => row.student.firstName,
    },
    {
      header: "LastName",
      accessorFn: (row) => row.student.lastName,
    },
    {
      header: "Gender",
      accessorFn: (row) => row.student.gender,
    },
    {
      header: "Score",
      accessorFn: (row) => row.score,
    },
    {
      header: "MaxScore",
      accessorFn: (row) => row.maxScore,
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions
          row={row}
          secondaryKey="id"
          dialogId="edit-student-score"
          onDelete={async () => handleStudentScoreDelete(row.original.id)}
          key="id"
          isPending={isDeleting}
        />
      ),
    },

    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,
      enableHiding: false,
      enableSorting: false,
      enableColumnFilter: false,
      enablePinning: false,
      enableResizing: false,
    },
  ] satisfies ColumnDef<GradeResponseType>[];
};
