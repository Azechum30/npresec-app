import { AtRiskStudentsType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";

export const useGetAtRiskStudentsColumns = () => {
  return [
    {
      header: "LastName",
      accessorFn: (row) => row.lastName,
    },
    {
      header: "FirstName",
      accessorFn: (row) => row.firstName,
    },
    {
      header: "MiddleName",
      accessorFn: (row) => row.middleName,
    },
    {
      header: "Gender",
      accessorFn: (row) => row.gender,
    },
    {
      header: "Class",
      accessorFn: (row) => row.className,
    },
    {
      header: "Grade",
      accessorFn: (row) => row.totalScore.toFixed(2) + "%",
    },
  ] satisfies ColumnDef<AtRiskStudentsType>[];
};
