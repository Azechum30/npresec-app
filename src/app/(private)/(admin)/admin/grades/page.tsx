import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { Suspense } from "react";
import { getStudentGrades } from "./_actions/get-student-grades";
import { PublishGradesForAllClassess } from "./_components/publish-grades-for-all-classes";
import { PublishResultsButton } from "./_components/publish-result-button";
import { RenderStudentsGradesTable } from "./_components/render-students-grades-table";
import { ScoreDetailView } from "./_components/score-detail-view";
import { FilterStudentGradesForm } from "./_forms/filter-student-grades-form";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function StudentsGradesPage({ searchParams }: SearchParams) {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
        <h4 className="font-medium text-base line-clamp-1">Grades</h4>
        <div className="flex flex-col md:flex-row gap-4">
          <PublishResultsButton />
          <PublishGradesForAllClassess />
        </div>
        <ScoreDetailView />
      </div>
      <FilterStudentGradesForm />
      <Suspense fallback={<FallbackComponent />}>
        <RenderStudentsGradesDataTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

const RenderStudentsGradesDataTable = async ({
  searchParams,
}: SearchParams) => {
  const params = await searchParams;

  const queryParams = {
    classId: params?.classId as string,
    academicYear: parseInt(params?.academicYear as string),
    semester: params?.semester as string,
  };

  const allParamsPresent =
    queryParams.classId && queryParams.academicYear && queryParams.semester;

  const result = allParamsPresent
    ? await getStudentGrades(
        queryParams.classId,
        queryParams.academicYear,
        queryParams.semester,
      )
    : {
        grades: undefined,
        error: undefined,
      };

  return (
    <RenderStudentsGradesTable data={result.grades} error={result.error} />
  );
};
