/** biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { ResultsVerification } from "@/components/customComponents/ResultsVerification";
import type { Metadata } from "next";
import { Suspense } from "react";
import { verifyStudentTranscipt } from "./_action/action";

type Params = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Student Transcript Verification",
  description:
    "Seamlessy verify the transcript records of students to ensure authenticity in an age characterized by deepfakes.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function VerifyStudentTranscriptValidityPage({
  params,
}: Params) {
  return (
    <Suspense fallback={<DotMatrixLoader />}>
      <RenderStudentTranscriptValidityComponent params={params} />
    </Suspense>
  );
}

const RenderStudentTranscriptValidityComponent = async ({ params }: Params) => {
  const { token } = await params;

  const summary = await verifyStudentTranscipt({ token });

  const isValid = !!summary?.isPublished;

  return (
    <ResultsVerification grades={summary} isValid={isValid} studentId={token} />
  );
};
