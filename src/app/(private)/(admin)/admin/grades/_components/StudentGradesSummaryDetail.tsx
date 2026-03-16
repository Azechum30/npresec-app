import { Row } from "@tanstack/react-table";
import { StudentGradeRow } from "../_hooks/use-get-students-grades-columns";

type Props = {
  row: Row<StudentGradeRow>;
};

export const StudentGradesSummaryDetail = ({ row }: Props) => {
  const { results } = row.original;

  return (
    <div className="grid gap-2 border bg-muted/50 p-4 rounded-lg">
      <h4 className="font-semibold">Course Breakdown</h4>
      {results.map((course, index) => (
        <div key={index} className="flex justify-between border-b py-1">
          <span>
            {course.code} - {course.title}
          </span>
          <span className="font-mono font-bold">
            {course.grade} ({course.totalWeighted.toFixed(2)}%){" "}
          </span>
        </div>
      ))}
    </div>
  );
};
