import OpenDialogs from "@/components/customComponents/OpenDialogs";
import { CreateStudentsScoresDialog } from "./_forms/create-students-scores-dialog";
import { getScoresAction } from "./_actions/get-scores-action";
import { AssesessmentType, Semester } from "@/lib/validation";
import { SearchQueryForm } from "./_components/search-query-form";
import { RenderScoresTable } from "./_components/render-scores-table";
import { getUserWithRole } from "@/utils/get-user-with-role";
import { SingleStudentScoreDialog } from "./_components/single-student-score-dialog";
import { unauthorized } from "next/navigation";
import { Suspense } from "react";
import { FallbackComponent } from "@/components/customComponents/fallback-component";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = "force-dynamic";

export default function ScoresPage({ searchParams }: Props) {
  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-between md:items-center">
        <h1 className="text-base font-medium line-clamp-1">Scores</h1>
        <OpenDialogs dialogKey="create-students-scores" />
      </div>
      <SearchQueryForm />

      <Suspense fallback={<FallbackComponent />}>
        <RenderScoresDataTable searchParams={searchParams} />
      </Suspense>

      <CreateStudentsScoresDialog />
      <SingleStudentScoreDialog />
    </div>
  );
}

const RenderScoresDataTable = async ({ searchParams }: Props) => {
  const { user } = await getUserWithRole("teacher");

  if (!user) {
    return unauthorized();
  }

  const { classId, courseId, semester, academicYear, assessmentType } =
    await searchParams;

  const queryParams = {
    classId: classId as string,
    courseId: courseId as string,
    semester: semester as (typeof Semester)[number],
    academicYear: parseInt(academicYear as string),
    assessmentType: assessmentType as AssesessmentType,
  };
  const allParamsPresent =
    classId && courseId && semester && academicYear && assessmentType;

  const result = allParamsPresent
    ? await getScoresAction(queryParams)
    : { error: undefined, scores: undefined };

  return <RenderScoresTable scores={result.scores} error={result.error} />;
};
