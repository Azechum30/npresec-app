/** biome-ignore-all assist/source/organizeImports: reason */
import { DotMatrixLoader } from "@/components/customComponents/dot-matrix-loader";
import { ResultsVerification } from "@/components/customComponents/ResultsVerification";
import { env } from "@/lib/server-only-actions/validate-env";
import type { Metadata } from "next";
import { Suspense } from "react";
import { verifyStudentTranscipt } from "./_action/action";

type Params = {
  params: Promise<{ token: string }>;
};

export const generateMetadata = async ({
  params,
}: Params): Promise<Metadata> => {
  const { token } = await params;

  const transcript = await verifyStudentTranscipt({ token });

  if (!transcript?.student) {
    return {
      title: "Transcript Not Found",
      description:
        "The requested academic transcript could not be found or is no longer available.",
      robots: { index: false },
    };
  }

  const fullName =
    `${transcript.student.firstName} ${transcript.student.lastName}`.trim();
  const { cgpa } = transcript;

  return {
    title: `${fullName} | Full Academic Transcript`,
    description: `Official Full Academic Transcript for ${fullName}. Overall GPA: ${cgpa || "N/A"} | Presbyterian Senior High Technical School (NPRESEC)`,

    keywords: [
      "Full Academic Transcript",
      "Official Transcript",
      "Student Transcript",
      "NPRESEC Transcript",
      fullName,
      "Presbyterian Senior High Technical School",
      "Academic Record",
    ],

    openGraph: {
      title: `${fullName} - Full Academic Transcript`,
      description: `Complete official academic record with overall GPA from NPRESEC`,
      url: `${env.NEXT_PUBLIC_URL}/verify-student-transcript/${token}`,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${fullName} Full Academic Transcript - NPRESEC`,
        },
      ],
      siteName: "NPRESEC MIS",
    },

    twitter: {
      card: "summary_large_image",
      title: `${fullName} - Full Transcript`,
      description: `Overall GPA: ${cgpa || "N/A"} | Complete Academic Record`,
    },

    alternates: {
      canonical: `${env.NEXT_PUBLIC_URL}/verify-student-transcript/${token}`,
    },

    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  };
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
