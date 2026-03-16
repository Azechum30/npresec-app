import { GenericRowExpansion } from "@/components/customComponents/GenericRowExpansion";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { fuzzyFilter } from "@/lib/fuzzyFilter";
import { StudentResponseType } from "@/lib/types";
import { ColumnDef } from "@tanstack/react-table";
import { FileBadge2, FileDown, Maximize2, MoreHorizontal } from "lucide-react";
import { Route } from "next";
import Link from "next/link";

export type StudentGradeRow = {
  id: string;
  student: StudentResponseType;
  summary: {
    tgp: string;
    tcr: number;
    gpa: string;
    cgv: string;
    ccr: number;
    cgpa: string;
    classRank?: number | null;
    totalStudents?: number | null;
    isPublished?: boolean | null;
  };
  results: Array<{
    code: string;
    title: string;
    grade: string;
    totalWeighted: number;
    credits: number;
    points: number;
  }>;
  metadata: {
    academicYear: number;
    semester: string;
    dateGenerated: string;
  };
};

export const useGetStudentsGradesColumns = () => {
  const { onOpen } = useGenericDialog();
  return [
    {
      accessorFn: (row: StudentGradeRow) =>
        `${row.student.firstName} ${row.student.lastName}`,
      id: "studentName",
      header: "Student",
      cell: (info) => info.getValue(),
      filterFn: fuzzyFilter,
    },
    {
      accessorKey: "summary.gpa", // Nested access
      header: "GPA (Sem)",
    },

    { accessorKey: "summary.tcr", header: "Credits (Sem)" },
    {
      accessorKey: "summary.cgpa",
      header: "CGPA",
    },
    { accessorKey: "summary.ccr", header: "TotalCredits" },
    {
      id: "courses",
      header: "CoursesPassed",
      cell: ({ row }) => {
        // Just showing a count or a string list
        return row.original.results.length;
      },
    },
    {
      id: "actions",
      header: "Report",
      cell: ({ row }) => {
        const studentId = row.original.student.id;
        const year = row.original.metadata.academicYear;
        const semester = row.original.metadata.semester;

        const downloadUrl = `/api/pdf/semester-report/${studentId}?academicYear=${year}&semester=${semester}`;
        const studentTranscriptDownloadUrl = `/api/pdf/transcript/${studentId}`;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Report Action</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href={downloadUrl as Route} download>
                  <FileDown className="size-5" />
                  Semester Statement
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  onOpen("view-score-details", row.original.student.id)
                }
                className="cursor-pointer">
                <Maximize2 className="size-5" />
                Expand Grades
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href={studentTranscriptDownloadUrl as Route} download>
                  <FileBadge2 className="size-5" />
                  Official Transcript
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "Expanded",
      header: ({ table }) => <GenericRowExpansion table={table} isHeader />,
      cell: ({ row }) => <GenericRowExpansion row={row} isHeader={false} />,
    },
  ] satisfies ColumnDef<StudentGradeRow>[];
};
