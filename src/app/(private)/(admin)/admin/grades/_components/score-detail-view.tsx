"use client";
import DataTable from "@/components/customComponents/data-table";
import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGenericDialog } from "@/hooks/use-open-create-teacher-dialog";
import { ASSESSMENT_WEIGHTS } from "@/lib/constants";
import { GradeResponseType } from "@/lib/types";
import { cn, getGradeInfo } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { columns } from "../_actions/columns";
import { getStudentRawScoreBreakdown } from "../_actions/get-student-raw-score-breakdown";
import { ScoreBreakdownDetailComponent } from "./score-breakdown-detail-component";

type CourseAggregateScore = {
  code: string;
  title: string;
  credits: number | null;
  totalWeighted: number;
  breakdown: Array<{
    type: string;
    rawScore: string;
    contribution: string;
  }>;
  letter: string;
  points: number;
};

export const ScoreDetailView = () => {
  const { id, dialogs, onClose } = useGenericDialog();
  const searchParams = useSearchParams();
  const [grades, setGrades] = useState<GradeResponseType[] | undefined>();

  const memoizedGrades = useMemo(() => {
    if (!grades) return [];

    const courseMap = new Map();

    grades.forEach((grade) => {
      if (!courseMap.has(grade.courseId)) {
        courseMap.set(grade.courseId, {
          code: grade.course.code,
          title: grade.course.title,
          credits: grade.course.credits,
          totalWeighted: 0,
          breakdown: [],
        });
      }

      const course = courseMap.get(grade.courseId);
      const weight = grade.weight || ASSESSMENT_WEIGHTS[grade.assessmentType];
      const contribution = (grade.score / grade.maxScore) * 100 * weight;

      // Use += to accumulate if there are multiple entries per course
      course.totalWeighted += contribution;

      course.breakdown.push({
        type: grade.assessmentType,
        rawScore: `${grade.score}/${grade.maxScore}`,
        contribution: contribution.toFixed(2) + "%",
      });
    });

    // Calculate final points/letters for each unique course
    return Array.from(courseMap.values()).map((co) => {
      const { point, letter } = getGradeInfo(co.totalWeighted);
      return { ...co, letter, points: point };
    });
  }, [grades]);

  useEffect(() => {
    if (!id || !dialogs["view-score-details"]) return;

    const params = new URLSearchParams(searchParams);

    const queryParams = {
      semester: params.get("semester"),
      academicYear: params.get("academicYear"),
    };

    if (!queryParams.semester || !queryParams.academicYear) return;

    startTransition(async () => {
      const result = await getStudentRawScoreBreakdown(
        id as string,
        queryParams.semester as string,
        parseInt(queryParams.academicYear as string),
      );

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setGrades(result.scores);
    });
  }, [id, dialogs, searchParams]);

  console.log("Memoized Grades", memoizedGrades);
  return (
    <Dialog
      open={dialogs["view-score-details"]}
      onOpenChange={() => onClose("view-score-details")}>
      {id && dialogs["view-score-details"] && (
        <DialogContent
          className={cn(
            "w-auto h-auto",
            grades &&
              grades?.length > 0 &&
              "w-full rounded-none md:max-w-5xl md:h-[95vh]",
          )}>
          <DialogHeader className="border-border border-b pb-4">
            <DialogTitle>Course Breakdown</DialogTitle>
            <DialogDescription>
              This shows a detailed breakdown of the student grades in each
              course.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 overflow-y-auto scrollbar-thin">
            <DataTable
              columns={columns}
              data={memoizedGrades}
              renderSubComponent={(row) => (
                <ScoreBreakdownDetailComponent row={row} />
              )}
            />
          </div>
          <DialogFooter className="w-full flex flex-row-reverse">
            <DialogClose
              className={buttonVariants({
                variant: "default",
                size: "lg",
                className: "w-full md:w-[25%]",
              })}>
              Close
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
};
