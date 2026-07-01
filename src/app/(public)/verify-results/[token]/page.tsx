/** biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { ResultsVerification } from "@/components/customComponents/ResultsVerification";
import type { Metadata } from "next";
import { Suspense } from "react";
import { verifyStudentResults } from "./_actions/action";

type Props = {
  params: Promise<{ token: string }>;
};

export const metadata: Metadata = {
  title: "Semester Statement Verification",
  description:
    "Verify the semester results of students to ensure authenticity in an age characterized by deepfakes.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function VerifyStudentResultsPage({ params }: Props) {
  return (
    <Suspense fallback={<DotMatrixLoader />}>
      <RenderResultsVerification params={params} />
    </Suspense>
  );
}

const RenderResultsVerification = async ({ params }: Props) => {
  const { token } = await params;

  const grades = await verifyStudentResults({ token });

  const isValid = !!grades.isPublished;

  return (
    <ResultsVerification isValid={isValid} grades={grades} studentId={token} />
  );
};
