import { FallbackComponent } from "@/components/customComponents/fallback-component";
import { ResultsVerification } from "@/components/customComponents/ResultsVerification";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";

type Params = {
  params: Promise<{ studentId: string }>;
};

export default function VerifyStudentTranscriptValidityPage({
  params,
}: Params) {
  return (
    <Suspense fallback={<FallbackComponent />}>
      <RenderStudentTranscriptValidityComponent params={params} />
    </Suspense>
  );
}

const RenderStudentTranscriptValidityComponent = async ({ params }: Params) => {
  const { studentId } = await params;

  if (!studentId) return;

  const transcriptSumamary = await prisma.semesterSummary.findFirst({
    where: { studentId },
    orderBy: [{ semester: "desc" }, { academicYear: "desc" }],

    include: { student: true },
  });

  const isValid = !!(transcriptSumamary && transcriptSumamary.isPublished);

  return (
    <ResultsVerification
      grades={transcriptSumamary}
      isValid={isValid}
      studentId={studentId}
      verificationDate={new Date()}
    />
  );
};
