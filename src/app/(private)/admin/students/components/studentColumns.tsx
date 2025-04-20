import { StudentResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { RowSelections } from "@/components/customComponents/RowSelections";
import { GenericActions } from "@/components/customComponents/GenericActions";
import { useDeleteStudent } from "../hooks/use-delete-student";
import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";

export const useGetColumns = () => {
  const { deletestudent } = useDeleteStudent();
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
      header: "ID",
      accessorFn: (row) => row.studentNumber,
    },
    {
      header: "FirstName",
      accessorFn: (row) => row.firstName,
    },
    {
      header: "LastName",
      accessorFn: (row) => row.lastName,
    },
    {
      header: "BirthDate",
      accessorFn: (row) => moment(row.birthDate).format("DD-MM-YY"),
    },
    {
      header: "Gender",
      accessorFn: (row) => row.gender,
    },
    {
      header: "CurrentLevel",
      accessorFn: (row) => row.currentLevel.split("_").join(" "),
    },
    {
      header: "Class",
      accessorFn: (row) =>
        row.currentClass?.name ? row.currentClass.name : "",
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <GenericActions<StudentResponseType>
          row={row}
          onDelete={deletestudent}
          secondaryKey="studentNumber"
        />
      ),
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    },

    {
      id: "expansion",
      header: ({ table }) => <GenericRowExpansion isHeader table={table} />,
      cell: ({ row }) => <GenericRowExpansion isHeader={false} row={row} />,

      enableHiding: false,
      enableColumnFilter: false,
      enableSorting: false,
      enablePinning: false,
      enableGrouping: false,
      enableGlobalFilter: false,
      enableResizing: false,
    },
  ] satisfies ColumnDef<StudentResponseType>[];
};
