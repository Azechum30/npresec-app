import { CourseAggregateScore } from "@/lib/types";
import { Row } from "@tanstack/react-table";

type Prop = {
  row: Row<CourseAggregateScore>;
};

export const ScoreBreakdownDetailComponent = ({ row }: Prop) => {
  const { breakdown } = row.original;

  return (
    <div className="bg-accent p-3 rounded-md">
      <h4 className="font-medium mb-3 px-3">Score Breakdown</h4>
      <div className="border rounded-md">
        <div className="grid grid-cols-3 border-border border-b px-3 py-3">
          <span>Assessment Type</span>
          <span>Raw Score</span>
          <span>Contribution</span>
        </div>
        {breakdown.map((item, index) => (
          <div
            className="grid grid-cols-3 border-border border-b px-3 py-3"
            key={index}>
            <span>{item.type}</span>
            <span>{item.rawScore}</span>
            <span>{item.contribution}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
