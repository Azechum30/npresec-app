import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { ResultsVerification } from "@/components/customComponents/ResultsVerification";
import { prisma } from "@/lib/prisma";
import { StudentSelect } from "@/lib/types";
import { Suspense } from "react";

type Props = {
  params: Promise<{ studentId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default function VerifyStudentResultsPage({
  params,
  searchParams,
}: Props) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <RenderResultsVerification params={params} searchParams={searchParams} />
    </Suspense>
  );
}

const RenderResultsVerification = async ({ params, searchParams }: Props) => {
  const { studentId } = await params;

  const { semester, academicYear } = await searchParams;

  if (!(semester && academicYear)) return;

  const queryParams = {
    semester: (semester as string) || "",
    academicYear: parseInt((academicYear as string) || "0"),
  };

  const grades = await prisma.semesterSummary.findUnique({
    where: {
      studentId_academicYear_semester: {
        studentId,
        semester: queryParams.semester,
        academicYear: queryParams.academicYear,
      },
    },
    include: {
      student: {
        select: StudentSelect,
      },
    },
  });

  const isValid = !!(grades && grades.isPublished);

  return (
    <ResultsVerification
      isValid={isValid}
      grades={grades}
      studentId={studentId}
      verificationDate={new Date()}
    />
  );
};
